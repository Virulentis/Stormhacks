#ifndef ANALYTICS_SERVICE
#define ANALYTICS_SERVICE

#include "CardPlaceholder.h"
Card maxPrice(Card cards[], int size);
Card minPrice(Card cards[], int size);
double priceMedian(Card cards[], int size);
double priceMean(Card cards[], int size);
double priceVariance(Card cards[], int size);
double priceVariance(Card cards[], int size, double mean);
double priceStandardDeviation(Card cards[], int size);
double priceStandardDeviation(Card cards[], int size, double variance);
#endif