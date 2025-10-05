#pragma once
#include <vector>
#include <string>
#include <map>
#include <numeric>
#include "models.h"

/**
 * @class AnalyticsService
 * @brief Provides basic statistical analysis of trading card data.
 */
class AnalyticsService {
public:
    struct Summary {
        double avg_price = 0.0;
        double min_price = 0.0;
        double max_price = 0.0;
        int total_cards = 0;
        int foil_count = 0;
        int art_count = 0;
        std::map<std::string, double> retailer_avg_price;
    };

    /**
     * @brief Computes statistics from all cards.
     * @param cards Input list of Card objects.
     * @return Summary object containing computed metrics.
     */
    Summary computeStats(const std::vector<Card>& cards);

private:
    double computeAveragePrice(const std::vector<Card>& cards);
};