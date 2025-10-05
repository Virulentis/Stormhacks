#include "AnalyticsService.h"
#include <algorithm>
#include <iostream>

AnalyticsService::Summary AnalyticsService::computeStats(const std::vector<Card>& cards) {
    Summary summary;
    if (cards.empty()) {
        std::cerr << "[AnalyticsService] No cards to analyze.\n";
        return summary;
    }

    summary.total_cards = static_cast<int>(cards.size());

    // Collect all prices
    std::vector<double> prices;
    prices.reserve(cards.size());
    for (const auto& c : cards) {
        if (c.price > 0) prices.push_back(c.price);
        if (c.foil) summary.foil_count++;
        if (c.artCard) summary.art_count++;
    }

    if (!prices.empty()) {
        summary.avg_price = std::accumulate(prices.begin(), prices.end(), 0.0) / prices.size();
        summary.min_price = *std::min_element(prices.begin(), prices.end());
        summary.max_price = *std::max_element(prices.begin(), prices.end());
    }

    // Compute average price per retailer
    std::map<std::string, std::vector<double>> retailer_prices;
    for (const auto& c : cards) {
        if (c.price > 0)
            retailer_prices[c.retailer].push_back(c.price);
    }

    for (auto& [retailer, prices_vec] : retailer_prices) {
        double avg = std::accumulate(prices_vec.begin(), prices_vec.end(), 0.0) / prices_vec.size();
        summary.retailer_avg_price[retailer] = avg;
    }

    std::cout << "[AnalyticsService] Processed " << summary.total_cards << " cards.\n";
    return summary;
}

double AnalyticsService::computeAveragePrice(const std::vector<Card>& cards) {
    if (cards.empty()) return 0.0;
    double sum = 0.0;
    int count = 0;
    for (const auto& c : cards) {
        if (c.price > 0) {
            sum += c.price;
            count++;
        }
    }
    return count > 0 ? sum / count : 0.0;
}