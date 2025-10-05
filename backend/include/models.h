#pragma once
#include <string>
#include "json.hpp"
#include <iostream>

using json = nlohmann::json;

/**
 * @struct Card
 * @brief Represents one trading-card record in memory.
 *
 *  Each card has basic identifying and commercial fields.
 *  Parsed directly from the scraper’s JSON output.
 */
struct Card {
    std::string name;
    std::string condition;
    double price = 0.0;
    std::string stock;
    std::string retailer;
    std::string edition;
    bool foil = false;
    bool artCard = false;
};

/**
 * @brief Converts a JSON object into a Card safely.
 *
 *  This version performs strict error-checking and type conversion:
 *   • Handles numbers stored as strings ("5.99").
 *   • Converts "true"/"1"/"Yes" → bool.
 *   • Skips malformed records but keeps valid ones.
 */
inline void from_json(const json& j, Card& c) {
    try {
        // Basic string fields
        if (j.contains("Name")) j.at("Name").get_to(c.name);
        if (j.contains("Card Condition")) j.at("Card Condition").get_to(c.condition);
        if (j.contains("Stock")) j.at("Stock").get_to(c.stock);
        if (j.contains("Retailer")) j.at("Retailer").get_to(c.retailer);
        if (j.contains("Edition")) j.at("Edition").get_to(c.edition);

        // Price may appear as a string or a number
        if (j.contains("Price")) {
            if (j.at("Price").is_string()) {
                try { c.price = std::stod(j.at("Price").get<std::string>()); }
                catch (...) { c.price = 0.0; }
            } else if (j.at("Price").is_number()) {
                j.at("Price").get_to(c.price);
            }
        }

        // Foil: interpret strings like "Yes"/"true"/"1"
        if (j.contains("Foil")) {
            if (j.at("Foil").is_boolean())
                j.at("Foil").get_to(c.foil);
            else if (j.at("Foil").is_string()) {
                auto val = j.at("Foil").get<std::string>();
                c.foil = (val == "true" || val == "True" || val == "Yes" || val == "1");
            }
        }

        // Art Card: same normalization logic
        if (j.contains("Art Card")) {
            if (j.at("Art Card").is_boolean())
                j.at("Art Card").get_to(c.artCard);
            else if (j.at("Art Card").is_string()) {
                auto val = j.at("Art Card").get<std::string>();
                c.artCard = (val == "true" || val == "True" || val == "Yes" || val == "1");
            }
        }

    } catch (const std::exception& e) {
        // Prevent one bad record from aborting the whole file
        std::cerr << "[CardService] Skipped malformed record: " << e.what() << std::endl;
        throw;
    }
}

/**
 * @brief Converts a Card struct back into JSON.
 *
 *  This is used when sending responses to the frontend
 *  or when caching card data back into Redis.
 */
inline void to_json(json& j, const Card& c) {
    j = json{
        {"Name", c.name},
        {"Card Condition", c.condition},
        {"Price", c.price},
        {"Stock", c.stock},
        {"Retailer", c.retailer},
        {"Edition", c.edition},
        {"Foil", c.foil},
        {"Art Card", c.artCard}
    };
}