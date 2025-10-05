#pragma once
#include <string>
#include "json.hpp"

using json = nlohmann::json;

/*
 * Card Data Model
 * Represents a single trading card record parsed from JSON.
 * Compatible with FaceToFaceGames / WizardTower scraper output.
 */
struct Card {
    std::string name;
    std::string condition;
    double price;
    std::string stock;
    std::string retailer;
    std::string edition;
    bool foil;
    bool artCard;
};

/*
 * Safely converts a JSON object to a Card struct.
 * Handles type mismatches (string vs. number, boolean vs. string).
 * Ignores extra fields (e.g., URL, Image, Timestamp).
 */
inline void from_json(const json& j, Card& c) {
    if (j.contains("Name"))
        j.at("Name").get_to(c.name);

    if (j.contains("Card Condition"))
        j.at("Card Condition").get_to(c.condition);

    // Convert price (could be string or number)
    if (j.contains("Price")) {
        if (j.at("Price").is_string()) {
            try {
                c.price = std::stod(j.at("Price").get<std::string>());
            } catch (...) {
                c.price = 0.0; // fallback if conversion fails
            }
        } else if (j.at("Price").is_number()) {
            j.at("Price").get_to(c.price);
        } else {
            c.price = 0.0;
        }
    }

    if (j.contains("Stock"))
        j.at("Stock").get_to(c.stock);

    if (j.contains("Retailer"))
        j.at("Retailer").get_to(c.retailer);

    if (j.contains("Edition"))
        j.at("Edition").get_to(c.edition);

    // Handle boolean-like strings (e.g., "true", "1")
    if (j.contains("Foil")) {
        if (j.at("Foil").is_boolean()) {
            j.at("Foil").get_to(c.foil);
        } else if (j.at("Foil").is_string()) {
            auto val = j.at("Foil").get<std::string>();
            c.foil = (val == "true" || val == "True" || val == "1");
        } else {
            c.foil = false;
        }
    } else {
        c.foil = false;
    }

    if (j.contains("Art Card")) {
        if (j.at("Art Card").is_boolean()) {
            j.at("Art Card").get_to(c.artCard);
        } else if (j.at("Art Card").is_string()) {
            auto val = j.at("Art Card").get<std::string>();
            c.artCard = (val == "true" || val == "True" || val == "1");
        } else {
            c.artCard = false;
        }
    } else {
        c.artCard = false;
    }
}

/*
 * Converts a Card struct back into a JSON object.
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