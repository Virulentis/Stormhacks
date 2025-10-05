#include "crow.h"
#include "json.hpp"
#include "models.h"
#include "services.h"

#include <iostream>
#include <thread>
#include <chrono>

using json = nlohmann::json;

int main() {
    crow::SimpleApp app;

    // Create a configuration
    CardService::Options opt;
    opt.json_path = "data/all_cards.json";
    opt.refresh_seconds = 60;
    //opt.redis_host = "127.0.0.1"; // if you have redis open it, please test json file first and then open it 

    // Creating a service instance
    CardService service(opt);

    // Start the automatic refresh thread
    service.startRefresher();

    // Registering Routes
    CROW_ROUTE(app, "/cards")
    ([&]() {
        auto cards = service.getAllCards();
        json j = cards;
        return crow::response{j.dump(2)};
    });

    // Starting HTTP 
    app.port(18080).multithreaded().run();

    // Stop refreshing threads when the program exits
    service.stopRefresher();
}