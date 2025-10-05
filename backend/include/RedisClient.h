#pragma once
#include <hiredis/hiredis.h>
#include <string>

class RedisClient {
public:
    RedisClient(const std::string& host, int port);
    ~RedisClient();

    bool connect();
    bool set(const std::string& key, const std::string& value);
    std::string get(const std::string& key);

private:
    std::string host_;
    int port_;
    redisContext* context_;
};