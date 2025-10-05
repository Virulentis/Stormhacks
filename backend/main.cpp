#include "crow.h"
#include "json.hpp"
#include "models.h"
#include "services.h"
#include "AnalyticsService.h"

#include <iostream>
#include <thread>
#include <chrono>

using json = nlohmann::json;

int main() {
    crow::SimpleApp app;

    // Create a configuration
    CardService::Options opt;
    opt.json_path = "../data/all_cards.json";
    opt.refresh_seconds = 60;
    //opt.redis_host = "127.0.0.1"; // if you have redis open it, please test json file first and then open it 

    // Creating a service instance
    CardService service(opt);

    // Start the automatic refresh thread
    service.startRefresher();

    AnalyticsService analytics;

    // Registering Routes -> return all card data
    CROW_ROUTE(app, "/cards")
    ([&]() {
        auto cards = service.getAllCards();
        json j = cards;
        return crow::response{j.dump(2)};
    });

    //Registering Routes -> return all analysis
      CROW_ROUTE(app, "/analytics")
([&]() {
    try {
        auto cards = service.getAllCards();
        AnalyticsService analytics;
        auto summary = analytics.computeStats(cards);

        json j = {
            {"avg_price", summary.avg_price},
            {"min_price", summary.min_price},
            {"max_price", summary.max_price},
            {"total_cards", summary.total_cards},
            {"foil_count", summary.foil_count},
            {"art_count", summary.art_count},
            {"retailer_avg_price", summary.retailer_avg_price}
        };

        return crow::response{j.dump(2)};
    }
    catch (const std::exception& e) {
        std::cerr << "[Error] /analytics failed: " << e.what() << std::endl;
         return crow::response(500, std::string("Internal Server Error: ") + e.what());
    }
});

    //Serve static dashboard page
    CROW_ROUTE(app, "/dashboard")
([]() {
    std::ifstream f("../frontend/analytics.html");
    if (!f.is_open())
        return crow::response(404, "Dashboard not found");
    std::string html((std::istreambuf_iterator<char>(f)), std::istreambuf_iterator<char>());
    return crow::response{html};
});

    // Starting HTTP 
    app.port(18080).multithreaded().run();

    // Stop refreshing threads when the program exits
    service.stopRefresher();
}