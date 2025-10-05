#include "services.h"
#include <fstream>
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * Constructor: initialize CardService with options
 * - Optionally connects to Redis (if redis_host is set)
 * - Immediately loads card data (from JSON or Redis)
 */
CardService::CardService(const Options& opt) : opt_(opt) {
    if (!opt_.redis_host.empty()) {
        redis_ = std::make_unique<RedisClient>(opt_.redis_host, opt_.redis_port);
        if (!redis_->connect()) {
            std::cerr << "[Redis] connect failed, disabling Redis\n";
            redis_.reset();
        }
    }
    refreshNow();
}

// Destructor: stop background refresher thread safely
CardService::~CardService() {
    stopRefresher();
}

// Start a background thread that refreshes the card cache periodically
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

//Stop the background refresh thread
void CardService::stopRefresher() {
    if (!running_.exchange(false)) return;
    if (worker_.joinable()) worker_.join();
}

// Return a thread-safe copy of the current cached card list
std::vector<Card> CardService::getAllCards() const {
    std::lock_guard<std::mutex> lk(mtx_);
    return cache_;
}

// Refresh the in-memory cache with the latest JSON data
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

// Load from disk
bool CardService::loadFromJson(std::vector<Card>& out) {
    std::ifstream f(opt_.json_path);
    if (!f) return false;
    json j;
    f >> j;
    out = j.get<std::vector<Card>>();
    return true;
}

// Push current card data to Redis 
// This allows other services or instances to access cached data quickly
bool CardService::pushToRedis(const std::vector<Card>& data) {
    std::cout << "[CardService] pushing to Redis " << data.size() << " cards..." << std::endl;

    if (!redis_) {
        std::cout << "[CardService] Redis not initialized, skip push." << std::endl;
        return false;
    }

    json j = data;
    std::string dump = j.dump();

    bool ok = redis_->set(opt_.redis_key, dump);
    if (ok)
        std::cout << "[CardService] Successfully pushed to Redis key: " 
                  << opt_.redis_key << std::endl;
    else
        std::cout << "[CardService] Failed to push to Redis." << std::endl;

    return ok;
}

// Load cached card data from Redis instead of JSON
bool CardService::loadFromRedis(std::vector<Card>& out) {
    if (!redis_) return false;
    std::string s = redis_->get(opt_.redis_key);
    if (s.empty()) return false;
    json j = json::parse(s, nullptr, false);
    if (!j.is_array()) return false;
    out = j.get<std::vector<Card>>();
    return true;
}