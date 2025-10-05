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
 * @brief Core service class that manages trading card data operations.
 *
 * Responsibilities:
 * - Load and parse card data from a local JSON file.
 * - Cache data in memory for fast access.
 * - Optionally push and retrieve data from Redis.
 * - Auto-refresh the dataset periodically using a background thread.
 */
class CardService {
public:
    struct Options {
        std::string json_path = "../../data/all_cards.json"; //Local JSON file path
        int refresh_seconds = 60;                       //Refresh interval in seconds
        std::string redis_host = "127.0.0.1";                    // Redis hostname (optional)
        int redis_port = 6379;                          //Redis port
        std::string redis_key = "cards_snapshot";       //Redis storage key
    };

    /**
     * @brief Constructor initializes CardService and optionally connects to Redis.
     * @param opt Configuration options for data paths and refresh intervals.
     */
    explicit CardService(const Options& opt);

    /**
     * @brief Destructor automatically stops the refresher thread.
     */
    ~CardService();

    /**
     * @brief Starts a background thread to periodically refresh data.
     */
    void startRefresher();

    /**
     * @brief Stops the background refresher thread.
     */
    void stopRefresher();

    /**
     * @brief Returns a copy of all currently cached cards.
     */
    std::vector<Card> getAllCards() const;

    /**
     * @brief Forces immediate reload from JSON (and Redis push if enabled).
     * @return True if successful, false otherwise.
     */
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