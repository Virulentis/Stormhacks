#pragma once
#include <vector>
#include <string>
#include <mutex>
#include <thread>
#include <atomic>
#include <memory>
#include "models.h"
#include "RedisClient.h"

/**
 * @class CardService
 * @brief Core service class that manages card data operations.
 *
 * Responsibilities:
 * - Load and parse card data from a local JSON file.
 * - Cache data in memory for fast access.
 * - Auto-refresh the dataset periodically using a background thread.
 */
class CardService {
public:
    struct Options {
        std::string json_path = "data/all_cards.json";
        int refresh_seconds = 60;
        std::string redis_host = "";
        int redis_port = 6379;
        std::string redis_key = "cards_snapshot";
    };

    //If Redis host is provided, automatically attempts to connect.
    explicit CardService(const Options& opt);
    ~CardService();
    /**
     * @brief Starts a background thread to periodically refresh data.
     */
    void startRefresher();
    /**
     * @brief Returns a copy of the current cached card data.
     */
    void stopRefresher();

    std::vector<Card> getAllCards() const;
    bool refreshNow();

private:
    bool loadFromJson(std::vector<Card>& out);
    bool pushToRedis(const std::vector<Card>& data);
    bool loadFromRedis(std::vector<Card>& out);

private:
    Options opt_;
    mutable std::mutex mtx_;
    std::vector<Card> cache_;

    std::atomic<bool> running_{false};
    std::thread worker_;

    std::unique_ptr<RedisClient> redis_;
};