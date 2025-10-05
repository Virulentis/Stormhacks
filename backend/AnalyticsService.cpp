#include <iostream>
#include <string>
#include <algorithm>
#include <cmath>
#include "CardPlaceholder.h"
#include "AnalyticsService.h"

Card maxPrice(Card cards[], int size){
    Card card = cards[0];
    for(int i=1; i<size; i++){
        if(card.price < cards[i].price){
            card = cards[i];
        };
    };
    return card;
}

Card minPrice(Card cards[], int size){
    Card card = cards[0];
    for(int i=1; i<size; i++){
        if(card.price > cards[i].price){
            card = cards[i];
        };
    };
    return card;
}

double priceMedian(Card cards[], int size){
    double prices[size];
    for(int i=0; i<size; i++){
        prices[i] = cards[i].price;
    }
    std::sort(prices, prices + size);

    if(size%2 == 1){
        return prices[size/2];
    } else {
        return (prices[size/2 - 1] + prices[size/2])/(double)2;
    }
}

double priceMean(Card cards[], int size){
    double sum = 0.0;
    for(int i=0; i<size; i++){
        sum += cards[i].price;
    }
    return sum/(double)size;
}

double priceVariance(Card cards[], int size){
    double mean = priceMean(cards, size);
    double sum = 0.0;
    for(int i=0; i<size; i++){
        sum += pow(cards[i].price - mean, 2);
    }
    return sum/(double)size;
}
double priceVariance(Card cards[], int size, double mean){
    double sum = 0.0;
    for(int i=0; i<size; i++){
        sum += pow(cards[i].price - mean, 2);
    }
    return sum/(double)size;
}

double priceStandardDeviation(Card cards[], int size){
    return sqrt(priceVariance(cards,size));
}
double priceStandardDeviation(Card cards[], int size, double variance){
    return sqrt(variance);
}