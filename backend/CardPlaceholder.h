#ifndef CARD_PLACEHOLDER
#define CARD_PLACEHOLDER
#include <string>
struct Card{//Placeholder model
    std::string name;
    std::string condition;
    double price;
    std::string stock;
    std::string retailer;
    std::string edition;
    bool foil;
    bool artCard;
};
#endif