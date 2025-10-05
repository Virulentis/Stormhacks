#include "redisclient.h"
#include <iostream>

/**
 * Constructor for RedisClient
 * Initializes connection parameters (host, port)
 * but does not connect immediately.
 */
RedisClient::RedisClient(const std::string& host, int port)
    : host_(host), port_(port), context_(nullptr) {}

RedisClient::~RedisClient() {
    if (context_) redisFree(context_);
}

/**
 * Establishes connection to Redis server using hiredis library.
 * 
 * @return true if connection is successful, false otherwise.
 */
bool RedisClient::connect() {
    context_ = redisConnect(host_.c_str(), port_);
    if (!context_ || context_->err) {
        std::cerr << "Redis connection error: " 
                  << (context_ ? context_->errstr : "unknown") << std::endl;
        return false;
    }
    return true;
}

/**
 * Executes a simple SET command to store a key-value pair in Redis.
 *
 * @param key   The Redis key
 * @param value The value to store (typically JSON string)
 * @return true if command succeeded, false if failed.
 */
bool RedisClient::set(const std::string& key, const std::string& value) {
    redisReply* reply = (redisReply*)redisCommand(context_, "SET %s %s", key.c_str(), value.c_str());
    if (!reply) return false;
    freeReplyObject(reply);
    return true;
}

/**
 * Executes a GET command to retrieve a value from Redis.
 *
 * @param key The Redis key to fetch.
 * @return The value as string if found; empty string otherwise.
 */
std::string RedisClient::get(const std::string& key) {
    redisReply* reply = (redisReply*)redisCommand(context_, "GET %s", key.c_str());
    if (!reply) return "";
    std::string result = reply->type == REDIS_REPLY_STRING ? reply->str : "";
    freeReplyObject(reply);
    return result;
}