#include "include/httplib.h"
#include "include/json.hpp"
#include <fstream>
using json = nlohmann::json;

json load_data() {
    std::ifstream f("data/scraped_401.json");
    if (!f.is_open()) return json::array();
    json j; f >> j;
    return j;
}

int main() {
    httplib::Server svr;

    svr.Get("/", [](const httplib::Request&, httplib::Response& res){
        res.set_content("Card Tracker API (cpp-httplib) running on macOS", "text/plain");
    });

    svr.Get("/cards", [](const httplib::Request&, httplib::Response& res){
        json data = load_data();
        res.set_content(data.dump(2), "application/json");
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get(R"(/cards/(.+))", [](const httplib::Request& req, httplib::Response& res){
        std::string name = req.matches[1];
        json data = load_data();
        json filtered = json::array();
        for (auto &item : data) {
            if (item.contains("name")) {
                std::string nm = item["name"].get<std::string>();
                if (nm.find(name) != std::string::npos) filtered.push_back(item);
            }
        }
        res.set_content(filtered.dump(2), "application/json");
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.listen("0.0.0.0", 8080);
}