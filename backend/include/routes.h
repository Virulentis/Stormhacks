#pragma once
#include "crow.h"
#include "services.h"

class CardRoutes {
public:
    static void registerRoutes(crow::SimpleApp& app, CardService& service) {
        // get all card
        CROW_ROUTE(app, "/api/cards")
        ([&service] {
            auto cards = service.getAllCards();
            nlohmann::json j = cards;
            return crow::response{j.dump(2)};
        });

        // refresh - frontend
        CROW_ROUTE(app, "/api/refresh")
        ([&service] {
            bool ok = service.refreshNow();
            return crow::response(ok ? " Refreshed successfully" : "Refresh failed");
        });

        // health check
        CROW_ROUTE(app, "/api/health")
        ([] {
            return crow::response(200, "OK");
        });
    }
};