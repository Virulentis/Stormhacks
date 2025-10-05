#include "services.h"
#include <fstream>
#include <iostream>
#include <unordered_map>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * @brief Constructor
 *  • Optionally connects to Redis.
 *  • Immediately loads JSON data into memory.
 */
CardService::CardService(const Options& opt) : opt_(opt) {
    if (!opt_.redis_host.empty()) {
        redis_ = std::make_unique<RedisClient>(opt_.redis_host, opt_.redis_port);
        if (!redis_->connect()) {
            std::cerr << "[Redis] Connection failed — disabled.\n";
            redis_.reset();
        }
    }
    refreshNow();
}

CardService::~CardService() { stopRefresher(); }

/**
 * @brief Starts a background thread that periodically refreshes data.
 */
void CardService::startRefresher() {
    if (running_.exchange(true)) return;
    worker_ = std::thread([this] {
        while (running_) {
            refreshNow();
            for (int i = 0; i < opt_.refresh_seconds && running_; ++i)
                std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    });
}

/**
 * @brief Stops the background refresher thread.
 */
void CardService::stopRefresher() {
    if (!running_.exchange(false)) return;
    if (worker_.joinable()) worker_.join();
}

/**
 * @brief Returns the in-memory cached cards.
 */
std::vector<Card> CardService::getAllCards() const {
    std::lock_guard<std::mutex> lk(mtx_);
    return cache_;
}

/**
 * @brief Forces an immediate refresh from JSON (and optionally pushes to Redis).
 */
bool CardService::refreshNow() {
    std::vector<Card> latest;
    if (!loadFromJson(latest)) return false;
    {
        std::lock_guard<std::mutex> lk(mtx_);
        cache_.swap(latest);
    }
    if (redis_) pushToRedis(cache_);
    std::cout << "[CardService] refreshed " << cache_.size() << " cards\n";
    return true;
}

/**
 * @brief Loads card data from a JSON file, skipping malformed entries.
 *  Also prints a retailer breakdown summary for debugging.
 */
bool CardService::loadFromJson(std::vector<Card>& out) {
    std::ifstream f(opt_.json_path);
    if (!f) {
        std::cerr << "[CardService] Failed to open " << opt_.json_path << "\n";
        return false;
    }

    json j;
    f >> j;
    out.clear();

    int skipped = 0;
    for (const auto& item : j) {
        try {
            out.push_back(item.get<Card>());
        } catch (...) {
            skipped++;
        }
    }

    // Print summary to help verify dataset size
    std::unordered_map<std::string, int> count;
    for (auto& c : out) count[c.retailer]++;

    std::cout << "[CardService] Successfully loaded " << out.size()
              << " cards. Skipped " << skipped << " malformed.\n";
    std::cout << "[CardService] Retailer breakdown:\n";
    for (auto& [r, n] : count)
        std::cout << "  - " << r << ": " << n << " cards\n";

    return true;
}

/**
 * @brief Pushes the current cache to Redis for persistence.
 */
bool CardService::pushToRedis(const std::vector<Card>& data) {
    if (!redis_) return false;
    json j = data;
    return redis_->set(opt_.redis_key, j.dump());
}

/**
 * @brief Loads cached data from Redis (if available).
 */
bool CardService::loadFromRedis(std::vector<Card>& out) {
    if (!redis_) return false;
    std::string s = redis_->get(opt_.redis_key);
    if (s.empty()) return false;
    json j = json::parse(s, nullptr, false);
    if (!j.is_array()) return false;
    out = j.get<std::vector<Card>>();
    return true;
}