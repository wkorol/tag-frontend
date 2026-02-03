import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createContext, useContext, useState, useEffect, useMemo, useRef, lazy, Suspense, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { useLocation, useNavigate, Link, useParams, Routes, Route, Navigate, useSearchParams, Outlet } from 'react-router-dom';
import { Globe, X, Menu, MessageCircle, Mail, Plane, BadgeCheck, Clock, CalendarCheck2, BadgeDollarSign, MapPin, Headphones, Car, Bus, Calculator, Users, Sun, Moon, ChevronLeft } from 'lucide-react';
import { createPortal } from 'react-dom';

const STORAGE_KEY$2 = "tag_locale";
const localeToPath = (locale) => {
  switch (locale) {
    case "pl":
      return "/pl";
    case "de":
      return "/de";
    case "fi":
      return "/fi";
    case "no":
      return "/no";
    case "sv":
      return "/sv";
    case "da":
      return "/da";
    case "en":
    default:
      return "/en";
  }
};
const localeToRootPath = (locale) => `${localeToPath(locale)}/`;
const baseEn = {
  common: {
    whatsapp: "WhatsApp",
    orderOnlineNow: "Check price and book TAXI",
    orderNow: "Book Now",
    close: "Close",
    noPrepayment: "No prepayment",
    backToHome: "← Back to home",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist or has moved.",
    notFoundCta: "Go to homepage",
    notFoundSupport: "If you think this is a mistake, contact us at",
    notFoundRequested: "Requested URL",
    notFoundPopular: "Popular pages",
    actualBadge: "ACTUAL",
    priceFrom: "from",
    perNight: "at night",
    perDay: "to City Center (day)",
    whatsappMessage: "Hello Taxi Airport Gdańsk, I would like to book a transfer."
  },
  navbar: {
    home: "Home",
    fleet: "Our Fleet",
    airportTaxi: "Gdańsk Airport Taxi",
    airportSopot: "Airport ↔ Sopot",
    airportGdynia: "Airport ↔ Gdynia",
    prices: "Prices",
    orderNow: "BOOK NOW",
    language: "Language"
  },
  hero: {
    promo: {
      dayPrice: "ONLY 100 PLN",
      dayLabel: "to City Center (day)",
      nightPrice: "120 PLN",
      nightLabel: "at night"
    },
    logoAlt: "Taxi Airport Gdańsk - Airport Transfer & Limousine Service",
    orderViaEmail: "Order via email",
    headline: "Taxi Gdańsk Airport Transfers for Gdańsk, Sopot & Gdynia",
    subheadline: "Book taxi Gdansk airport rides with fixed prices, 24/7 service, and fast confirmation.",
    whyChoose: "Why choose Taxi Airport Gdańsk",
    benefits: "Benefits",
    benefitsList: {
      flightTrackingTitle: "Flight tracking",
      flightTrackingBody: "We monitor arrivals and adjust pickup time automatically.",
      meetGreetTitle: "Meet & greet",
      meetGreetBody: "Professional drivers, clear communication, and help with luggage.",
      fastConfirmationTitle: "Fast confirmation",
      fastConfirmationBody: "Most bookings are confirmed within 5–10 minutes.",
      flexiblePaymentsTitle: "Flexible payments",
      flexiblePaymentsBody: "Card, Apple Pay, Google Pay, Revolut, or cash.",
      freePrebookingTitle: "Free prebooking",
      freePrebookingBody: "Cancel anytime for free. Fully automated, no support needed.",
      fixedPriceTitle: "Fixed price guarantee",
      fixedPriceBody: "Fixed price both ways. The price you book is the price you pay.",
      localExpertiseTitle: "Local expertise",
      localExpertiseBody: "Experienced Tri-City drivers who know the fastest routes.",
      assistanceTitle: "24/7 assistance",
      assistanceBody: "Always available before, during, and after your ride."
    },
    fleetTitle: "Our Fleet",
    fleetLabel: "Vehicles",
    standardCarsTitle: "Standard Cars",
    standardCarsBody: "1-4 passengers | Comfortable sedans and SUVs",
    busTitle: "& More Buses",
    busBody: "5-8 passengers | Perfect for larger groups"
  },
  vehicle: {
    title: "Choose Your Vehicle",
    subtitle: "Select the vehicle type that best fits your group size",
    standardTitle: "Standard Car",
    standardPassengers: "1-4 passengers",
    standardDescription: "Perfect for individuals, couples, and small families",
    busTitle: "BUS Service",
    busPassengers: "5-8 passengers",
    busDescription: "Ideal for larger groups and families with extra luggage",
    examplePrices: "Example prices:",
    airportGdansk: "Airport ↔ Gdańsk",
    airportSopot: "Airport ↔ Sopot",
    airportGdynia: "Airport ↔ Gdynia",
    selectStandard: "Select Standard Car",
    selectBus: "Select BUS Service"
  },
  pricing: {
    back: "Back to vehicle selection",
    titleStandard: "Standard Car (1-4 passengers)",
    titleBus: "BUS Service (5-8 passengers)",
    description: "Fixed prices both ways (to and from the airport). No hidden fees. Night rate applies from 10 PM to 6 AM and on Sundays & public holidays.",
    dayRate: "Day rate",
    nightRate: "Night rate",
    sundayNote: "(Sundays & holidays)",
    customRouteTitle: "Custom Route",
    customRouteBody: "Need a different destination?",
    customRoutePrice: "Fixed prices",
    customRoutePriceBody: "Flexible pricing based on your specific route",
    customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
    requestQuote: "Book now",
    pricesNote: "Prices include VAT. Additional destinations available on request.",
    tableTitle: "Price table",
    tableRoute: "Route",
    tableStandardDay: "Standard day",
    tableStandardNight: "Standard night",
    tableBusDay: "Bus day",
    tableBusNight: "Bus night",
    tariffsTitle: "Custom route pricing",
    tariffsName: "Tariff",
    tariffsRate: "Rate",
    bookingTitle: "Book a transfer",
    bookingSubtitle: "Choose the vehicle type and reserve your ride instantly.",
    routes: {
      airport: "Airport",
      gdansk: "Gdańsk City Center",
      gdynia: "Gdynia City Center"
    }
  },
  pricingLanding: {
    title: "Gdańsk Airport Taxi Prices",
    subtitle: "Fixed rates for airport transfers and transparent pricing for custom routes.",
    description: "Compare standard and bus prices, then book instantly or request a quote for a custom transfer.",
    cta: "Book a transfer",
    calculatorCta: "Calculator",
    highlights: [
      {
        title: "Fixed prices both ways",
        body: "The listed airport routes are priced upfront, with no hidden fees."
      },
      {
        title: "24/7 availability",
        body: "We operate every day with fast confirmation and support."
      },
      {
        title: "Bus service for groups",
        body: "Spacious 5–8 seat vehicles for families and larger groups."
      }
    ],
    faqTitle: "Pricing FAQ",
    faq: [
      {
        question: "Are these prices fixed?",
        answer: "Yes. Airport routes have fixed prices in both directions. Custom routes are priced individually."
      },
      {
        question: "When does the night rate apply?",
        answer: "From 22:00 to 6:00 and on Sundays & public holidays."
      },
      {
        question: "Do you monitor flight delays?",
        answer: "Yes. We track arrivals and adjust pickup time automatically."
      },
      {
        question: "Can I pay by card?",
        answer: "Card payments are available on request. Invoices are available for business clients."
      }
    ]
  },
  pricingCalculator: {
    title: "Price calculator",
    subtitle: "Enter pickup and destination to estimate the fare.",
    airportLabel: "Gdańsk Airport",
    airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    pickupCustomLabel: "Pickup from address",
    destinationCustomLabel: "Destination address",
    pickupLabel: "Pickup location",
    pickupPlaceholder: "e.g. Gdańsk Airport, Słowackiego 200",
    destinationLabel: "Destination",
    destinationPlaceholder: "e.g. Sopot, Monte Cassino 1",
    distanceLabel: "Distance",
    resultsTitle: "Estimated price",
    fixedAllDay: "All-day rate",
    dayRate: "Day rate",
    nightRate: "Night rate",
    dayRateLabel: "Day rate",
    allDayRateLabel: "All-day rate",
    guaranteedPriceLabel: "Guaranteed price",
    standard: "Standard",
    bus: "Bus",
    loading: "Calculating route...",
    noResult: "We could not calculate this route. Try a more precise address.",
    longRouteTitle: "Long route estimate",
    taximeterLabel: "Taximeter",
    proposedLabel: "Proposed price",
    savingsLabel: "Savings",
    orderNow: "Book now",
    note: "Prices are fixed. You can propose a different price in the custom route order form."
  },
  trust: {
    companyTitle: "Company details",
    paymentTitle: "Payment & invoices",
    comfortTitle: "Comfort & safety",
    paymentBody: "Cash or card on request. Invoices available for business clients.",
    comfortBody: "Child seats available on request. Professional, licensed drivers and door-to-door assistance."
  },
  footer: {
    description: "Professional airport transfer service in the Tri-City area. Available 24/7.",
    contactTitle: "Contact",
    location: "Gdańsk, Poland",
    bookingNote: "Book online, via WhatsApp, or email",
    hoursTitle: "Service Hours",
    hoursBody: "24/7 - Available every day",
    hoursSub: "Airport pickups, city transfers, and custom routes",
    routesTitle: "Popular Routes",
    rights: "All rights reserved.",
    cookiePolicy: "Cookie Policy",
    privacyPolicy: "Privacy Policy"
  },
  cookieBanner: {
    title: "Cookie settings",
    body: "We use essential cookies to keep the booking process secure and reliable. With your permission, we also use marketing cookies to measure ad conversions and improve how we communicate offers. You can update your choice at any time by clearing your browser storage.",
    readPolicy: "Read the policy",
    decline: "Decline",
    accept: "Accept cookies"
  },
  cookiePolicy: {
    title: "Cookie Policy",
    updated: "Last updated: January 2, 2026",
    intro: "This website uses cookies to ensure the site works reliably and to keep your booking safe. With your consent, we also use marketing cookies to measure ad conversions.",
    sectionCookies: "What cookies we use",
    cookiesList: [
      "Essential cookies to keep the site secure and prevent abuse.",
      "Preference cookies to remember basic choices during a session.",
      "Marketing cookies to measure conversions from ads (Google Ads)."
    ],
    sectionManage: "How you can manage cookies",
    manageBody1: "You can delete cookies at any time from your browser settings. Blocking essential cookies may prevent the booking form and order management from working properly.",
    manageBody2: "You can also change your marketing cookie preference by clearing your browser storage and revisiting this site.",
    contact: "Contact",
    contactBody: "If you have questions about this policy, contact us at"
  },
  privacyPolicy: {
    title: "Privacy Policy",
    updated: "Last updated: January 2, 2026",
    intro: "This Privacy Policy explains how Taxi Airport Gdańsk collects and processes personal data when you use our booking services and website.",
    controllerTitle: "Data controller",
    controllerBody: "Taxi Airport Gdańsk\nGdańsk, Poland\nEmail:",
    dataTitle: "What data we collect",
    dataList: [
      "Contact details such as name, email address, and phone number.",
      "Booking details such as pickup location, date, time, flight number, and notes.",
      "Technical data such as IP address and basic browser information for security."
    ],
    whyTitle: "Why we process your data",
    whyList: [
      "To respond to your booking request and deliver the requested service.",
      "To communicate about your booking, changes, or cancellations.",
      "To comply with legal obligations and prevent misuse."
    ],
    legalTitle: "Legal basis",
    legalList: [
      "Contract performance (Article 6(1)(b) GDPR).",
      "Legal obligation (Article 6(1)(c) GDPR).",
      "Legitimate interests (Article 6(1)(f) GDPR), such as security and fraud prevention."
    ],
    storageTitle: "How long we store data",
    storageBody: "We keep booking data only as long as necessary to provide the service and meet legal or accounting requirements.",
    shareTitle: "Who we share data with",
    shareBody: "We share data only with service providers necessary to deliver the booking service (such as email delivery providers). We do not sell your personal data.",
    rightsTitle: "Your rights",
    rightsList: [
      "Access, rectification, or deletion of your personal data.",
      "Restriction or objection to processing.",
      "Data portability where applicable.",
      "Right to lodge a complaint with a supervisory authority."
    ],
    contactTitle: "Contact",
    contactBody: "For privacy-related requests, contact us at"
  },
  routeLanding: {
    orderNow: "Book Online Now",
    quickLinks: "Quick links",
    pricingLink: "View pricing",
    orderLinks: {
      airportGdansk: "Book airport → Gdańsk",
      airportSopot: "Book airport → Sopot",
      airportGdynia: "Book airport → Gdynia",
      custom: "Custom route"
    },
    seoParagraph: (route) => `Taxi Gdansk airport transfers for ${route}. Fixed prices, 24/7 service, meet & greet, and fast confirmation for taxi airport Gdansk rides.`,
    pricingTitle: "Example prices",
    pricingSubtitle: (route) => `Standard car for ${route}`,
    vehicleLabel: "Standard car",
    dayLabel: "Day rate",
    nightLabel: "Night rate",
    currency: "PLN",
    pricingNote: "Prices include VAT. Night rate applies from 10 PM to 6 AM and on Sundays & public holidays.",
    includedTitle: "What is included",
    includedList: [
      "Meet & greet at the airport with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Fixed pricing both ways with no hidden fees.",
      "Professional, English-speaking drivers."
    ],
    destinationsTitle: "Popular destinations",
    faqTitle: "FAQ",
    faq: [
      {
        question: "How fast is confirmation?",
        answer: "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        question: "Do you track flights?",
        answer: "Yes, we monitor arrivals and adjust pickup time accordingly."
      },
      {
        question: "Can I cancel?",
        answer: "You can cancel using the link sent in your confirmation email."
      },
      {
        question: "Do you offer child seats?",
        answer: "Yes, child seats are available on request during booking."
      },
      {
        question: "How do I pay?",
        answer: "You can pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
      },
      {
        question: "Where do I meet the driver?",
        answer: "You will receive clear pickup instructions and contact details in the confirmation email."
      }
    ]
  },
  countryLanding: {
    title: "Gdansk Airport Transfer for UK Travelers",
    description: "Private airport transfer in Gdansk with fixed prices, 24/7 pickups, and English-speaking drivers.",
    intro: "Ideal for flights from the UK to Gdańsk Airport (GDN). Book online in minutes and get fast email confirmation.",
    ctaPrimary: "Book transfer",
    ctaSecondary: "See prices",
    highlightsTitle: "Why UK travelers choose us",
    highlights: [
      "Fixed prices in PLN with no hidden fees.",
      "Meet & greet at arrivals with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    airportsTitle: "Common departure airports (UK)",
    airports: [
      "London Stansted (STN)",
      "London Luton (LTN)",
      "Manchester (MAN)",
      "Edinburgh (EDI)",
      "Birmingham (BHX)",
      "Liverpool (LPL)"
    ],
    faqTitle: "FAQ for UK travelers",
    faq: [
      {
        question: "Can I pay in GBP?",
        answer: "Prices are in PLN. Card payments are automatically converted by your bank."
      },
      {
        question: "Do you provide receipts or invoices?",
        answer: "Yes, tell us in the booking notes and we will send a receipt or invoice by email."
      },
      {
        question: "Is confirmation quick?",
        answer: "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        question: "Do you track flights?",
        answer: "Yes, we monitor arrivals and adjust pickup time accordingly."
      }
    ]
  },
  airportLanding: {
    title: (city, airport) => `${city} → Gdańsk Airport Transfer (${airport})`,
    description: (city, airport) => `Private transfer from ${airport} to Gdańsk, Sopot, and Gdynia with fixed prices and 24/7 pickup.`,
    intro: (city, airport) => `Direct flights from ${airport} to Gdańsk operate seasonally. Book your transfer in advance for a smooth arrival.`,
    ctaPrimary: "Book transfer",
    ctaSecondary: "See prices",
    highlightsTitle: "Why book in advance",
    highlights: [
      "Meet & greet at arrivals with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Fixed prices in PLN with no hidden fees.",
      "Pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    routeTitle: (airport) => `From ${airport} to Gdańsk`,
    routeBody: (airport) => `We serve arrivals from ${airport} and provide door-to-door transfers to Gdańsk, Sopot, and Gdynia.`,
    destinationsTitle: "Popular destinations in the Tri-City",
    faqTitle: "FAQ",
    faq: [
      {
        question: "Are there direct flights from {city} to Gdańsk?",
        answer: "Direct flights operate seasonally. Check the current schedule before booking."
      },
      {
        question: "How do I meet the driver?",
        answer: "You will receive pickup instructions and contact details in the confirmation email."
      },
      {
        question: "Is flight tracking included?",
        answer: "Yes, we monitor arrivals and adjust pickup time if needed."
      },
      {
        question: "Can I pay by card?",
        answer: "Yes, card payments are accepted. Cash is also available on request."
      }
    ]
  },
  cityTaxi: {
    title: "Taxi Gdańsk",
    subtitle: "Fixed-price taxi rides in Gdańsk with 24/7 availability.",
    intro: "Book a reliable taxi in Gdańsk for airport transfers and city rides. Professional drivers, fast confirmation, and clear pricing.",
    ctaPrimary: "Book taxi",
    ctaSecondary: "See prices",
    highlightsTitle: "Why book a taxi with us",
    highlights: [
      "Fixed prices and no hidden fees.",
      "24/7 availability for airport and city rides.",
      "Flight tracking and flexible pickup time.",
      "Card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    serviceAreaTitle: "Service area",
    serviceArea: [
      "Gdańsk Old Town and City Center",
      "Gdańsk Wrzeszcz and Oliwa",
      "Gdańsk Airport (GDN)",
      "Sopot and Gdynia"
    ],
    routesTitle: "Popular taxi routes",
    routes: [
      "Gdańsk Airport → Old Town",
      "Gdańsk Airport → Sopot",
      "Gdańsk Airport → Gdynia",
      "Old Town → Gdańsk Airport"
    ],
    cityRoutesTitle: "Gdańsk Airport taxi price by city",
    cityRoutesDescription: "Check the current taxi price from Gdańsk Airport to these destinations.",
    cityRoutesItem: (destination) => `Taxi price from Gdańsk Airport to ${destination}`,
    faqTitle: "FAQ",
    faq: [
      {
        question: "How fast is confirmation?",
        answer: "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        question: "Do you offer fixed prices?",
        answer: "Yes, airport routes have fixed prices both ways."
      },
      {
        question: "Can I pay by card?",
        answer: "Yes, card payments are accepted. Cash is also available on request."
      },
      {
        question: "Do you track flights?",
        answer: "Yes, we monitor arrivals and adjust pickup time."
      }
    ]
  },
  orderForm: {
    validation: {
      phoneLetters: "Please enter a valid phone number (digits only).",
      phoneLength: "Please enter a valid phone number (7–15 digits, optional +).",
      email: "Please enter a valid email address.",
      datePast: "Please select today or a future date."
    },
    rate: {
      day: "Day rate",
      night: "Night rate",
      reasonDay: "standard day rate",
      reasonLate: "pickup after 21:30 or before 5:30",
      reasonHoliday: "Sunday/public holiday",
      banner: (label, price, reason) => `Applied ${label}: ${price} PLN (${reason}).`
    },
    submitError: "Failed to submit order. Please try again.",
    submitNetworkError: "Network error while submitting the order. Please try again.",
    submittedTitle: "Order received",
    submittedBody: "Thanks! Your request is in the queue. Please wait for acceptance – it usually takes 5–10 minutes. You will receive a confirmation email shortly.",
    awaiting: "Awaiting confirmation...",
    totalPrice: "Total Price:",
    orderNumber: "Order #:",
    orderId: "Order ID:",
    manageLink: "Manage or edit your order",
    title: "Order Transfer",
    date: "Date",
    pickupTime: "Pickup Time",
    pickupType: "Pickup Type",
    pickupTypeHint: "Choose a pickup type to continue.",
    airportPickup: "Airport Pickup",
    addressPickup: "Address Pickup",
    signServiceTitle: "Airport arrival pickup",
    signServiceSign: "Meet with a name sign",
    signServiceFee: "+20 PLN added to final price",
    signServiceSelf: "Find the driver myself at the parking",
    signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    signText: "Name Sign Text",
    signPlaceholder: "Text to display on the pickup sign",
    signHelp: "The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall",
    signPreview: "Sign Preview:",
    signEmpty: "Your name will appear here",
    flightNumber: "Flight Number",
    flightPlaceholder: "e.g. LO123",
    pickupAddress: "Pickup Address",
    pickupPlaceholder: "Enter full pickup address",
    passengers: "Number of Passengers",
    passengerLabel: (count) => `${count} ${count === 1 ? "person" : "people"}`,
    passengersBus: ["5 people", "6 people", "7 people", "8 people"],
    passengersStandard: ["1 person", "2 people", "3 people", "4 people"],
    largeLuggage: "Large Luggage",
    luggageNo: "No",
    luggageYes: "Yes",
    contactTitle: "Contact Information",
    fullName: "Full Name",
    namePlaceholder: "Your name",
    phoneNumber: "Phone Number",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    emailHelp: "You'll receive a confirmation email with a link to edit or cancel your order",
    notesTitle: "Additional Notes (Optional)",
    notesPlaceholder: "Any special requests or additional information...",
    notesHelp: "E.g., child seat required, waiting time, special instructions",
    submitting: "Submitting...",
    formIncomplete: "Complete the form to continue",
    missingFields: (fields) => `Please complete: ${fields}.`,
    reassurance: "No prepayment. Free cancellation. Confirmation in 5–10 min.",
    confirmOrder: (price) => `Confirm Order - ${price} PLN`
  },
  quoteForm: {
    validation: {
      phoneLetters: "Please enter a valid phone number (digits only).",
      phoneLength: "Please enter a valid phone number (7–15 digits, optional +).",
      email: "Please enter a valid email address.",
      datePast: "Please select today or a future date."
    },
    submitError: "Failed to submit quote request. Please try again.",
    submitNetworkError: "Network error while submitting the quote request. Please try again.",
    submittedTitle: "Quote Request Received!",
    submittedBody: "Thank you for your request. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.",
    manageLink: "Manage your order",
    title: "Request Custom Quote",
    subtitle: "Propose your price and get a response within 5-10 minutes",
    requestButton: "Book Transfer",
    requestAnother: "Book Another Transfer",
    toggleDescription: "Provide your ride details and propose your price. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.",
    pickupType: "Pickup Type",
    airportPickup: "Airport Pickup",
    addressPickup: "Address Pickup",
    lockMessage: "Select a pickup type to unlock the rest of the form.",
    pickupAddress: "Pickup Address",
    pickupPlaceholder: "Enter full pickup address (e.g., Gdańsk Airport, ul. Słowackiego 200)",
    pickupAutoNote: "Airport pickup location is automatically set",
    destinationAddress: "Destination Address",
    destinationPlaceholder: "Enter destination address (e.g., Gdańsk Centrum, ul. Długa 1)",
    price: "Price",
    proposedPriceLabel: "Your Proposed Price (PLN)",
    taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
    tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
    fixedPriceHint: "If you want to propose a fixed price, click here and fill the input.",
    pricePlaceholder: "Enter your offer in PLN (e.g., 150)",
    priceHelp: "Propose your price for this ride. We'll review and respond within 5-10 minutes.",
    fixedRouteChecking: "Checking if this route qualifies for a fixed price...",
    fixedRouteTitle: "Fixed price available",
    fixedRouteBody: (route, price) => `${route} - fixed price ${price} PLN.`,
    fixedRouteCta: "Book fixed price",
    fixedRouteHint: "Use the fixed-price booking for the fastest confirmation.",
    fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
    fixedRouteAllDay: "All-day rate applies",
    fixedRouteDay: "Day rate applies",
    fixedRouteNight: "Night rate applies",
    fixedRouteLocked: "This route qualifies for a fixed price. Please book via the fixed-price form.",
    fixedRouteComputed: (price) => `Fixed price calculated: ${price} PLN`,
    fixedRouteFooter: (price) => `Book transfer - ${price} PLN`,
    longRouteTitle: "Long route estimate",
    longRouteDistance: (distance) => `Distance: ${distance} km`,
    longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
    longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
    longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
    longRouteNote: "You can still enter your own price below.",
    date: "Date",
    pickupTime: "Pickup Time",
    signServiceTitle: "Airport arrival pickup",
    signServiceSign: "Meet with a name sign",
    signServiceFee: "+20 PLN added to final price",
    signServiceSelf: "Find the driver myself at the parking",
    signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    signText: "Name Sign Text",
    signPlaceholder: "Text to display on the pickup sign",
    signHelp: "The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall",
    signPreview: "Sign Preview:",
    signEmpty: "Your name will appear here",
    flightNumber: "Flight Number",
    flightPlaceholder: "e.g. LO123",
    passengers: "Number of Passengers",
    passengersOptions: ["1 person", "2 people", "3 people", "4 people", "5+ people"],
    largeLuggage: "Large Luggage",
    luggageNo: "No",
    luggageYes: "Yes",
    contactTitle: "Contact Information",
    fullName: "Full Name",
    namePlaceholder: "Your name",
    phoneNumber: "Phone Number",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    emailHelp: "You'll receive a response within 5-10 minutes",
    notesTitle: "Additional Notes (Optional)",
    notesPlaceholder: "Any special requests or additional information...",
    notesHelp: "E.g., child seat required, waiting time, special instructions",
    submitting: "Submitting...",
    formIncomplete: "Complete the form to continue",
    missingFields: (fields) => `Please complete: ${fields}.`,
    submit: "Book Transfer"
  },
  manageOrder: {
    errors: {
      load: "Unable to load the order.",
      loadNetwork: "Network error while loading the order.",
      save: "Unable to save changes.",
      saveNetwork: "Network error while saving changes.",
      cancel: "Unable to cancel the order.",
      cancelNetwork: "Network error while cancelling the order.",
      copySuccess: "Copied to clipboard",
      copyFail: "Unable to copy to clipboard",
      emailRequired: "Please enter your email address."
    },
    loading: "Loading your order...",
    accessTitle: "Access your booking",
    accessBody: "Enter the email address used during booking to access your order details.",
    accessPlaceholder: "you@example.com",
    accessAction: "Continue",
    accessChecking: "Checking...",
    cancelledTitle: "Order Cancelled",
    cancelledBody: "Your order has been cancelled. If this was a mistake, please create a new booking.",
    manageTitle: "Manage Your Transfer",
    copyAction: "Copy",
    orderLabel: "Order #",
    orderIdLabel: "Order ID",
    detailsUpdatedTitle: "Details updated",
    detailsUpdatedBody: (date, time) => `Thank you! Your details were updated successfully. Your transfer remains confirmed for ${date} at ${time}. We will see you then.`,
    updateSubmittedTitle: "Update submitted",
    updateSubmittedBody: "Your update request was sent. We will review it and respond shortly.",
    awaiting: "Awaiting confirmation...",
    transferRoute: "Transfer Route",
    priceLabel: "Price:",
    pricePending: "Price confirmed individually",
    taximeterTitle: "Price calculated by taximeter",
    taximeterRates: "View taximeter rates",
    tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    statusConfirmed: "Confirmed",
    statusCompleted: "Completed",
    statusFailed: "Not completed",
    statusRejected: "Rejected",
    statusPriceProposed: "Price Proposed",
    statusPending: "Pending",
    bookingDetails: "Booking Details",
    editDetails: "Edit Details",
    updateRequested: "Update Requested Fields",
    confirmedEditNote: "Editing a confirmed order will send it back for approval. You will receive a new confirmation email.",
    updateFieldsNote: "Please update the highlighted fields and save your changes.",
    confirmedNote: "This order has been confirmed.",
    completedNote: "This order has been marked as completed.",
    failedNote: "This order has been marked as not completed.",
    priceProposedNote: "A new price has been proposed to you. Please check your email to accept or reject the new price.",
    rejectedNote: "This order has been rejected. Editing is disabled, but you can still cancel the booking.",
    rejectionReasonLabel: "Reason:",
    date: "Date",
    pickupTime: "Pickup Time",
    signServiceTitle: "Airport arrival pickup",
    signServiceSign: "Meet with a name sign",
    signServiceFee: "+20 PLN added to final price",
    signServiceSelf: "Find the driver myself at the parking",
    signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    signText: "Name Sign Text",
    flightNumber: "Flight Number",
    pickupAddress: "Pickup Address",
    passengers: "Number of Passengers",
    passengersBus: ["5 people", "6 people", "7 people", "8 people"],
    passengersStandard: ["1 person", "2 people", "3 people", "4 people"],
    largeLuggage: "Large Luggage",
    luggageNo: "No",
    luggageYes: "Yes",
    contactTitle: "Contact Information",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    email: "Email Address",
    notesTitle: "Additional Notes (Optional)",
    saveChanges: "Save Changes",
    cancelEdit: "Cancel",
    editBooking: "Edit Booking",
    cancelBooking: "Cancel Booking",
    changesNotice: "Changes to your booking will be confirmed via email. For urgent changes, please contact us directly at booking@taxiairportgdansk.com",
    updateRequestNote: "Your booking has been updated. Please review and confirm the changes.",
    rejectNote: "This booking has been rejected. Contact support if you have questions.",
    cancelPromptTitle: "Cancel Booking?",
    cancelPromptBody: "Are you sure you want to cancel this booking? This action cannot be undone.",
    confirmCancel: "Yes, cancel",
    keepBooking: "Keep booking",
    copyOrderLabel: "Order #",
    copyOrderIdLabel: "Order ID"
  },
  adminOrders: {
    title: "Admin Orders",
    subtitle: "All recent orders and statuses.",
    loading: "Loading orders...",
    missingToken: "Missing admin token.",
    errorLoad: "Failed to load orders.",
    filters: {
      all: "All",
      active: "In progress",
      completed: "Completed",
      failed: "Not completed",
      rejected: "Rejected"
    },
    statuses: {
      pending: "Pending",
      confirmed: "Confirmed",
      price_proposed: "Price proposed",
      completed: "Completed",
      failed: "Not completed",
      rejected: "Rejected"
    },
    columns: {
      order: "Order",
      pickup: "Pickup",
      customer: "Customer",
      price: "Price",
      status: "Status",
      open: "Open"
    },
    empty: "No orders found.",
    pendingPrice: (price) => `Pending: ${price} PLN`,
    view: "View"
  },
  adminOrder: {
    title: "Admin Order Details",
    subtitle: "Manage, confirm, or reject this order.",
    back: "Back to all orders",
    loading: "Loading order...",
    missingToken: "Missing admin token.",
    errorLoad: "Failed to load order.",
    updated: "Order updated.",
    updateError: "Failed to update order.",
    statusUpdated: "Order status updated.",
    updateRequestSent: "Update request sent to the customer.",
    updateRequestError: "Failed to send update request.",
    updateRequestSelect: "Select at least one field to update.",
    orderLabel: "Order",
    idLabel: "ID",
    customerLabel: "Customer",
    pickupLabel: "Pickup",
    priceLabel: "Price",
    pendingPrice: (price) => `Pending: ${price} PLN`,
    additionalInfo: "Additional info",
    passengers: "Passengers:",
    largeLuggage: "Large luggage:",
    pickupType: "Pickup type:",
    signService: "Pickup service:",
    signServiceSign: "Meet with a name sign",
    signServiceSelf: "Find the driver myself",
    signFee: "Sign fee:",
    flightNumber: "Flight number:",
    signText: "Sign text:",
    route: "Route:",
    notes: "Notes:",
    adminActions: "Admin Actions",
    confirmOrder: "Confirm order",
    rejectOrder: "Reject order",
    proposePrice: "Propose new price (PLN)",
    sendPrice: "Send price proposal",
    rejectionReason: "Rejection reason (optional)",
    requestUpdate: "Request customer update",
    requestUpdateBody: "Select the fields the customer should update. They will receive an email with a link to edit their booking.",
    fieldPhone: "Phone number",
    fieldEmail: "Email address",
    fieldFlight: "Flight number",
    requestUpdateAction: "Request update",
    cancelConfirmedTitle: "Cancel confirmed order",
    cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
    cancelConfirmedAction: "Cancel confirmed order",
    cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
    cancelConfirmedSuccess: "Order cancelled.",
    deleteRejectedTitle: "Delete rejected order",
    deleteRejectedBody: "Remove this rejected order permanently.",
    deleteRejectedAction: "Delete rejected order",
    deleteRejectedConfirm: "Delete this rejected order permanently?",
    deleteRejectedSuccess: "Order deleted.",
    completionTitle: "Completion status",
    markCompleted: "Mark completed",
    markCompletedConfirm: "Mark this order as completed?",
    markFailed: "Mark not completed",
    markFailedConfirm: "Mark this order as not completed?"
  },
  pages: {
    gdanskTaxi: {
      title: "Gdańsk Airport Taxi",
      description: "Book a fast, reliable airport taxi from Gdańsk Airport. Fixed pricing both ways, professional drivers, and quick confirmation.",
      route: "Gdańsk Airport",
      examples: ["Gdańsk Old Town", "Gdańsk Oliwa", "Gdańsk Main Station", "Brzeźno Beach"],
      priceDay: 100,
      priceNight: 120
    },
    gdanskSopot: {
      title: "Gdańsk Airport to Sopot Transfer",
      description: "Private transfer between Gdańsk Airport and Sopot with fixed pricing both ways and flight tracking.",
      route: "Gdańsk Airport ↔ Sopot",
      examples: ["Sopot Pier", "Sopot Centre", "Sopot Hotels", "Sopot Railway Station"],
      priceDay: 120,
      priceNight: 150
    },
    gdanskGdynia: {
      title: "Gdańsk Airport to Gdynia Transfer",
      description: "Comfortable transfer between Gdańsk Airport and Gdynia with fixed pricing both ways.",
      route: "Gdańsk Airport ↔ Gdynia",
      examples: ["Gdynia Centre", "Gdynia Port", "Gdynia Hotels", "Gdynia Orłowo"],
      priceDay: 200,
      priceNight: 250
    }
  }
};
const translations = {
  en: baseEn,
  pl: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Sprawdź cenę i zarezerwuj TAXI",
      orderNow: "Rezerwuj",
      close: "Zamknij",
      noPrepayment: "Bez przedpłaty",
      backToHome: "← Wróć na stronę główną",
      notFoundTitle: "Nie znaleziono strony",
      notFoundBody: "Szukana strona nie istnieje lub została przeniesiona.",
      notFoundCta: "Przejdź na stronę główną",
      notFoundSupport: "Jeśli to błąd, skontaktuj się z nami:",
      notFoundRequested: "Żądany adres URL",
      notFoundPopular: "Popularne strony",
      actualBadge: "AKTUALNY",
      priceFrom: "od",
      perNight: "nocą",
      perDay: "do centrum (dzień)",
      whatsappMessage: "Dzień dobry Taxi Airport Gdańsk, chcę zarezerwować transfer."
    },
    navbar: {
      home: "Start",
      fleet: "Nasza flota",
      airportTaxi: "Taxi Lotnisko Gdańsk",
      airportSopot: "Lotnisko ↔ Sopot",
      airportGdynia: "Lotnisko ↔ Gdynia",
      prices: "Cennik",
      orderNow: "REZERWUJ",
      language: "Język"
    },
    hero: {
      promo: {
        dayPrice: "TYLKO 100 PLN",
        dayLabel: "do centrum (dzień)",
        nightPrice: "120 PLN",
        nightLabel: "nocą"
      },
      logoAlt: "Taxi Airport Gdańsk - Transfer lotniskowy i limuzyny",
      orderViaEmail: "Zamów przez e-mail",
      headline: "Taxi Gdańsk Lotnisko – transfery dla Gdańska, Sopotu i Gdyni",
      subheadline: "Taxi Gdańsk / taxi gdansk: stałe ceny, 24/7 i szybkie potwierdzenie.",
      whyChoose: "Dlaczego Taxi Airport Gdańsk",
      benefits: "Korzyści",
      benefitsList: {
        flightTrackingTitle: "Śledzenie lotu",
        flightTrackingBody: "Monitorujemy przyloty i automatycznie dostosowujemy czas odbioru.",
        meetGreetTitle: "Powitanie na lotnisku",
        meetGreetBody: "Profesjonalni kierowcy, jasna komunikacja i pomoc z bagażem.",
        fastConfirmationTitle: "Szybkie potwierdzenie",
        fastConfirmationBody: "Większość rezerwacji potwierdzamy w 5–10 minut.",
        flexiblePaymentsTitle: "Elastyczne płatności",
        flexiblePaymentsBody: "Karta, Apple Pay, Google Pay, Revolut lub gotówka.",
        freePrebookingTitle: "Darmowa rezerwacja z wyprzedzeniem",
        freePrebookingBody: "Anuluj w dowolnym momencie bez opłat. W pełni automatycznie.",
        fixedPriceTitle: "Gwarancja stałej ceny",
        fixedPriceBody: "Stała cena w obie strony. Cena z rezerwacji to cena zapłaty.",
        localExpertiseTitle: "Lokalne doświadczenie",
        localExpertiseBody: "Doświadczeni kierowcy z Trójmiasta znający najszybsze trasy.",
        assistanceTitle: "Wsparcie 24/7",
        assistanceBody: "Dostępni przed, w trakcie i po przejeździe."
      },
      fleetTitle: "Nasza flota",
      fleetLabel: "Pojazdy",
      standardCarsTitle: "Samochody standard",
      standardCarsBody: "1–4 pasażerów | Komfortowe sedany i SUV-y",
      busTitle: "Busy i więcej",
      busBody: "5–8 pasażerów | Idealne dla większych grup"
    },
    vehicle: {
      title: "Wybierz pojazd",
      subtitle: "Wybierz pojazd najlepiej dopasowany do liczby osób",
      standardTitle: "Samochód standard",
      standardPassengers: "1–4 pasażerów",
      standardDescription: "Idealny dla singli, par i małych rodzin",
      busTitle: "Usługa BUS",
      busPassengers: "5–8 pasażerów",
      busDescription: "Idealny dla większych grup i rodzin z większym bagażem",
      examplePrices: "Przykładowe ceny:",
      airportGdansk: "Lotnisko ↔ Gdańsk",
      airportSopot: "Lotnisko ↔ Sopot",
      airportGdynia: "Lotnisko ↔ Gdynia",
      selectStandard: "Wybierz standard",
      selectBus: "Wybierz BUS"
    },
    pricing: {
      back: "Wróć do wyboru pojazdu",
      titleStandard: "Samochód standard (1–4 pasażerów)",
      titleBus: "BUS (5–8 pasażerów)",
      description: "Stałe ceny w obie strony (na i z lotniska). Bez ukrytych opłat. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
      dayRate: "Taryfa dzienna",
      nightRate: "Taryfa nocna",
      sundayNote: "(niedziele i święta)",
      customRouteTitle: "Trasa niestandardowa",
      customRouteBody: "Inny cel podróży?",
      customRoutePrice: "Ceny ustalone",
      customRoutePriceBody: "Elastyczna wycena na podstawie Twojej trasy",
      customRouteAutoNote: "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
      requestQuote: "Rezerwuj",
      pricesNote: "Ceny zawierają VAT. Dodatkowe destynacje dostępne na zapytanie.",
      tableTitle: "Tabela cen",
      tableRoute: "Trasa",
      tableStandardDay: "Standard dzienna",
      tableStandardNight: "Standard nocna",
      tableBusDay: "Bus dzienna",
      tableBusNight: "Bus nocna",
      tariffsTitle: "Wycena tras niestandardowych",
      tariffsName: "Taryfa",
      tariffsRate: "Stawka",
      bookingTitle: "Zarezerwuj przejazd",
      bookingSubtitle: "Wybierz typ pojazdu i zarezerwuj przejazd od razu.",
      routes: {
        airport: "Lotnisko",
        gdansk: "Centrum Gdańska",
        gdynia: "Centrum Gdyni"
      }
    },
    pricingLanding: {
      title: "Cennik Taxi Lotnisko Gdańsk",
      subtitle: "Stałe ceny transferów lotniskowych oraz przejrzysta wycena tras niestandardowych.",
      description: "Porównaj ceny standard i bus, a potem zarezerwuj od razu lub poproś o wycenę.",
      cta: "Zarezerwuj przejazd",
      calculatorCta: "Kalkulator",
      highlights: [
        {
          title: "Stałe ceny w obie strony",
          body: "Podane trasy lotniskowe mają z góry ustaloną cenę bez ukrytych opłat."
        },
        {
          title: "Dostępność 24/7",
          body: "Pracujemy codziennie, szybkie potwierdzenie i wsparcie."
        },
        {
          title: "Busy dla grup",
          body: "Pojazdy 5–8 miejsc dla rodzin i większych ekip."
        }
      ],
      faqTitle: "FAQ cennika",
      faq: [
        {
          question: "Czy te ceny są stałe?",
          answer: "Tak. Trasy lotniskowe mają stałe ceny w obie strony. Trasy niestandardowe są wyceniane indywidualnie."
        },
        {
          question: "Kiedy obowiązuje taryfa nocna?",
          answer: "Od 22:00 do 6:00 oraz w niedziele i święta."
        },
        {
          question: "Czy monitorujecie opóźnienia lotów?",
          answer: "Tak, śledzimy przyloty i dostosowujemy czas odbioru."
        },
        {
          question: "Czy można zapłacić kartą?",
          answer: "Tak, płatność kartą na życzenie. Faktury dla firm."
        }
      ]
    },
    pricingCalculator: {
      title: "Kalkulator ceny",
      subtitle: "Podaj miejsce odbioru i cel, aby zobaczyć szacunkową cenę.",
      airportLabel: "Lotnisko Gdańsk",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Odbiór z adresu",
      destinationCustomLabel: "Adres docelowy",
      pickupLabel: "Miejsce odbioru",
      pickupPlaceholder: "np. Gdańsk Airport, Słowackiego 200",
      destinationLabel: "Miejsce docelowe",
      destinationPlaceholder: "np. Sopot, Monte Cassino 1",
      distanceLabel: "Dystans",
      resultsTitle: "Szacunkowa cena",
      fixedAllDay: "Taryfa całodobowa",
      dayRate: "Taryfa dzienna",
      nightRate: "Taryfa nocna",
      dayRateLabel: "Stawka dzienna",
      allDayRateLabel: "Całodobowa stawka",
      guaranteedPriceLabel: "Gwarantowana cena",
      standard: "Standard",
      bus: "Bus",
      loading: "Obliczamy trasę...",
      noResult: "Nie udało się wycenić trasy. Spróbuj dokładniejszego adresu.",
      longRouteTitle: "Wycena długiej trasy",
      taximeterLabel: "Taksometr",
      proposedLabel: "Sugerowana cena",
      savingsLabel: "Oszczędzasz",
      orderNow: "Zamów teraz",
      note: "Ceny są stałe, możesz zaproponować inną cenę w formularzu do zamawiania innej trasy."
    },
    trust: {
      companyTitle: "Dane firmy",
      paymentTitle: "Płatność i faktury",
      comfortTitle: "Komfort i bezpieczeństwo",
      paymentBody: "Gotówka lub karta na życzenie. Faktury dla firm.",
      comfortBody: "Foteliki dziecięce na życzenie. Profesjonalni, licencjonowani kierowcy i pomoc door-to-door."
    },
    footer: {
      description: "Profesjonalny transfer lotniskowy w Trójmieście. Dostępny 24/7.",
      contactTitle: "Kontakt",
      location: "Gdańsk, Polska",
      bookingNote: "Rezerwacja online, przez WhatsApp lub e-mail",
      hoursTitle: "Godziny pracy",
      hoursBody: "24/7 - Dostępne każdego dnia",
      hoursSub: "Odbiory z lotniska, transfery miejskie i trasy niestandardowe",
      routesTitle: "Popularne trasy",
      rights: "Wszelkie prawa zastrzeżone.",
      cookiePolicy: "Polityka cookies",
      privacyPolicy: "Polityka prywatności"
    },
    cookieBanner: {
      title: "Ustawienia cookies",
      body: "Używamy niezbędnych cookies, aby zapewnić bezpieczny i niezawodny proces rezerwacji. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam i poprawy komunikacji ofert. W każdej chwili możesz zmienić wybór, czyszcząc dane przeglądarki.",
      readPolicy: "Przeczytaj politykę",
      decline: "Odrzuć",
      accept: "Akceptuj cookies"
    },
    cookiePolicy: {
      title: "Polityka cookies",
      updated: "Ostatnia aktualizacja: 2 stycznia 2026",
      intro: "Ta strona używa cookies, aby działała niezawodnie i aby Twoja rezerwacja była bezpieczna. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam.",
      sectionCookies: "Jakich cookies używamy",
      cookiesList: [
        "Niezbędne cookies do zapewnienia bezpieczeństwa i zapobiegania nadużyciom.",
        "Cookies preferencji do zapamiętania podstawowych wyborów w trakcie sesji.",
        "Cookies marketingowe do mierzenia konwersji z reklam (Google Ads)."
      ],
      sectionManage: "Jak możesz zarządzać cookies",
      manageBody1: "Możesz usunąć cookies w każdej chwili w ustawieniach przeglądarki. Zablokowanie niezbędnych cookies może uniemożliwić działanie formularza rezerwacji i panelu zamówień.",
      manageBody2: "Możesz też zmienić zgodę marketingową, czyszcząc dane przeglądarki i ponownie odwiedzając stronę.",
      contact: "Kontakt",
      contactBody: "Jeśli masz pytania dotyczące tej polityki, napisz do nas na"
    },
    privacyPolicy: {
      title: "Polityka prywatności",
      updated: "Ostatnia aktualizacja: 2 stycznia 2026",
      intro: "Niniejsza Polityka prywatności wyjaśnia, jak Taxi Airport Gdańsk zbiera i przetwarza dane osobowe podczas korzystania z naszych usług i strony.",
      controllerTitle: "Administrator danych",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Polska\nEmail:",
      dataTitle: "Jakie dane zbieramy",
      dataList: [
        "Dane kontaktowe, takie jak imię, adres e-mail i numer telefonu.",
        "Dane rezerwacji, takie jak miejsce odbioru, data, godzina, numer lotu i uwagi.",
        "Dane techniczne, takie jak adres IP i podstawowe informacje o przeglądarce w celach bezpieczeństwa."
      ],
      whyTitle: "Dlaczego przetwarzamy Twoje dane",
      whyList: [
        "Aby odpowiedzieć na zapytanie i zrealizować usługę.",
        "Aby komunikować się w sprawie rezerwacji, zmian lub anulowania.",
        "Aby wypełnić obowiązki prawne i zapobiegać nadużyciom."
      ],
      legalTitle: "Podstawa prawna",
      legalList: [
        "Wykonanie umowy (art. 6 ust. 1 lit. b RODO).",
        "Obowiązek prawny (art. 6 ust. 1 lit. c RODO).",
        "Uzasadniony interes (art. 6 ust. 1 lit. f RODO), np. bezpieczeństwo i zapobieganie nadużyciom."
      ],
      storageTitle: "Jak długo przechowujemy dane",
      storageBody: "Przechowujemy dane rezerwacji tak długo, jak jest to konieczne do realizacji usługi oraz spełnienia wymogów prawnych lub księgowych.",
      shareTitle: "Komu udostępniamy dane",
      shareBody: "Udostępniamy dane tylko podmiotom niezbędnym do realizacji usługi (np. dostawcom e-mail). Nie sprzedajemy danych osobowych.",
      rightsTitle: "Twoje prawa",
      rightsList: [
        "Dostęp, sprostowanie lub usunięcie danych osobowych.",
        "Ograniczenie przetwarzania lub sprzeciw.",
        "Przenoszenie danych, jeśli ma zastosowanie.",
        "Prawo do złożenia skargi do organu nadzorczego."
      ],
      contactTitle: "Kontakt",
      contactBody: "W sprawach prywatności skontaktuj się z nami pod adresem"
    },
    routeLanding: {
      orderNow: "Rezerwuj online teraz",
      quickLinks: "Szybkie linki",
      pricingLink: "Zobacz cennik",
      orderLinks: {
        airportGdansk: "Rezerwacja lotnisko → Gdańsk",
        airportSopot: "Rezerwacja lotnisko → Sopot",
        airportGdynia: "Rezerwacja lotnisko → Gdynia",
        custom: "Trasa niestandardowa"
      },
      seoParagraph: (route) => `Taxi lotnisko Gdańsk dla trasy ${route}. Taxi Gdańsk / taxi gdansk: stałe ceny, 24/7, szybkie potwierdzenie i śledzenie lotu.`,
      pricingTitle: "Przykładowe ceny",
      pricingSubtitle: (route) => `Samochód standard dla trasy ${route}`,
      vehicleLabel: "Samochód standard",
      dayLabel: "Taryfa dzienna",
      nightLabel: "Taryfa nocna",
      currency: "PLN",
      pricingNote: "Ceny zawierają VAT. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
      includedTitle: "Co obejmuje usługa",
      includedList: [
        "Powitanie na lotnisku i jasne instrukcje odbioru.",
        "Śledzenie lotu i elastyczny czas odbioru.",
        "Stałe ceny w obie strony bez ukrytych opłat.",
        "Profesjonalni kierowcy mówiący po angielsku."
      ],
      destinationsTitle: "Popularne kierunki",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Jak szybko dostanę potwierdzenie?",
          answer: "Większość rezerwacji potwierdzamy e-mailem w 5–10 minut."
        },
        {
          question: "Czy śledzicie loty?",
          answer: "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
        },
        {
          question: "Czy mogę anulować?",
          answer: "Możesz anulować korzystając z linku w e-mailu potwierdzającym."
        },
        {
          question: "Czy oferujecie foteliki dziecięce?",
          answer: "Tak, foteliki dziecięce są dostępne na życzenie podczas rezerwacji."
        },
        {
          question: "Jak mogę zapłacić?",
          answer: "Możesz zapłacić kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
        },
        {
          question: "Gdzie spotkam kierowcę?",
          answer: "Otrzymasz jasne instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
        }
      ]
    },
    countryLanding: {
      title: "Transfer lotniskowy Gdańsk dla podróżnych z zagranicy",
      description: "Prywatny transfer z lotniska Gdańsk ze stałymi cenami, odbiór 24/7 i szybkie potwierdzenie.",
      intro: "Idealne rozwiązanie dla osób przylatujących do Gdańska (GDN). Rezerwuj online w kilka minut.",
      ctaPrimary: "Zarezerwuj transfer",
      ctaSecondary: "Zobacz ceny",
      highlightsTitle: "Dlaczego warto z nami",
      highlights: [
        "Stałe ceny bez ukrytych opłat.",
        "Meet & greet i jasne instrukcje odbioru.",
        "Śledzenie lotów i elastyczny czas odbioru.",
        "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
      ],
      airportsTitle: "Popularne lotniska w Europie",
      airports: [
        "Londyn Stansted (STN)",
        "Frankfurt (FRA)",
        "Oslo Gardermoen (OSL)",
        "Sztokholm Arlanda (ARN)",
        "Kopenhaga (CPH)",
        "Helsinki (HEL)"
      ],
      faqTitle: "FAQ",
      faq: [
        {
          question: "W jakiej walucie płacę?",
          answer: "Ceny są w PLN. Płatność kartą zostanie automatycznie przeliczona przez bank."
        },
        {
          question: "Czy wystawiacie paragon lub fakturę?",
          answer: "Tak, wpisz to w uwagach do rezerwacji — wyślemy dokument e-mailem."
        },
        {
          question: "Czy śledzicie loty?",
          answer: "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
        },
        {
          question: "Jak szybko dostanę potwierdzenie?",
          answer: "Zwykle w 5–10 minut e-mailem."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Transfer lotniskowy Gdańsk (${airport})`,
      description: (city, airport) => `Prywatny transfer z ${airport} do Gdańska, Sopotu i Gdyni. Stałe ceny i odbiór 24/7.`,
      intro: (city, airport) => `Bezpośrednie loty z ${airport} do Gdańska są sezonowe. Zarezerwuj transfer wcześniej.`,
      ctaPrimary: "Zarezerwuj transfer",
      ctaSecondary: "Zobacz ceny",
      highlightsTitle: "Dlaczego warto zarezerwować wcześniej",
      highlights: [
        "Meet & greet i jasne instrukcje odbioru.",
        "Śledzenie lotów i elastyczny czas odbioru.",
        "Stałe ceny bez ukrytych opłat.",
        "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
      ],
      routeTitle: (airport) => `Z ${airport} do Gdańska`,
      routeBody: (airport) => `Obsługujemy przyloty z ${airport} i dowozimy pod wskazany adres w Gdańsku, Sopocie i Gdyni.`,
      destinationsTitle: "Popularne kierunki w Trójmieście",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Czy są loty bezpośrednie z {city} do Gdańska?",
          answer: "Loty bezpośrednie są sezonowe. Sprawdź aktualny rozkład przed podróżą."
        },
        {
          question: "Jak spotkam kierowcę?",
          answer: "Otrzymasz instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
        },
        {
          question: "Czy śledzicie loty?",
          answer: "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
        },
        {
          question: "Czy mogę zapłacić kartą?",
          answer: "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Stałe ceny i dostępność 24/7.",
      intro: "Taxi Gdańsk na transfery lotniskowe i przejazdy miejskie. Profesjonalni kierowcy, szybkie potwierdzenie i przejrzyste ceny.",
      ctaPrimary: "Zarezerwuj taxi",
      ctaSecondary: "Zobacz ceny",
      highlightsTitle: "Dlaczego warto jechać z nami",
      highlights: [
        "Stałe ceny bez ukrytych opłat.",
        "Dostępność 24/7 na lotnisko i miasto.",
        "Śledzenie lotów i elastyczny czas odbioru.",
        "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
      ],
      serviceAreaTitle: "Obsługiwane obszary",
      serviceArea: [
        "Gdańsk Stare Miasto i Centrum",
        "Gdańsk Wrzeszcz i Oliwa",
        "Lotnisko Gdańsk (GDN)",
        "Sopot i Gdynia"
      ],
      routesTitle: "Popularne trasy taxi",
      routes: [
        "Lotnisko Gdańsk → Stare Miasto",
        "Lotnisko Gdańsk → Sopot",
        "Lotnisko Gdańsk → Gdynia",
        "Stare Miasto → Lotnisko Gdańsk"
      ],
      cityRoutesTitle: "Ceny taxi z lotniska Gdańsk",
      cityRoutesDescription: "Sprawdź cenę przejazdu z lotniska Gdańsk do wybranych miast.",
      cityRoutesItem: (destination) => `Cena taxi z lotniska Gdańsk do ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Jak szybko dostanę potwierdzenie?",
          answer: "Większość rezerwacji potwierdzamy w 5–10 minut e-mailem."
        },
        {
          question: "Czy ceny są stałe?",
          answer: "Tak, trasy lotniskowe mają stałe ceny w obie strony."
        },
        {
          question: "Czy mogę zapłacić kartą?",
          answer: "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
        },
        {
          question: "Czy śledzicie loty?",
          answer: "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Wpisz poprawny numer telefonu (tylko cyfry).",
        phoneLength: "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
        email: "Wpisz poprawny adres e-mail.",
        datePast: "Wybierz dzisiejszą lub przyszłą datę."
      },
      rate: {
        day: "Taryfa dzienna",
        night: "Taryfa nocna",
        reasonDay: "standardowa taryfa dzienna",
        reasonLate: "odbiór po 21:30 lub przed 5:30",
        reasonHoliday: "niedziela/święto",
        banner: (label, price, reason) => `Zastosowano ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Nie udało się wysłać zamówienia. Spróbuj ponownie.",
      submitNetworkError: "Błąd sieci podczas wysyłania zamówienia. Spróbuj ponownie.",
      submittedTitle: "Zamówienie przyjęte",
      submittedBody: "Dziękujemy! Twoje zgłoszenie jest w kolejce. Zaczekaj na akceptację – zwykle trwa to 5–10 minut. Wkrótce otrzymasz e-mail z potwierdzeniem.",
      awaiting: "Oczekiwanie na potwierdzenie...",
      totalPrice: "Cena całkowita:",
      orderNumber: "Nr zamówienia:",
      orderId: "ID zamówienia:",
      manageLink: "Zarządzaj lub edytuj zamówienie",
      title: "Zamów transfer",
      date: "Data",
      pickupTime: "Godzina odbioru",
      pickupType: "Miejsce odbioru",
      pickupTypeHint: "Wybierz typ odbioru, aby kontynuować.",
      airportPickup: "Odbiór z lotniska",
      addressPickup: "Odbiór z adresu",
      signServiceTitle: "Odbiór na lotnisku",
      signServiceSign: "Odbiór z kartką",
      signServiceFee: "+20 PLN doliczone do ceny końcowej",
      signServiceSelf: "Znajdę kierowcę samodzielnie na parkingu",
      signServiceSelfNote: "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
      signText: "Tekst na tabliczce",
      signPlaceholder: "Tekst na tabliczce powitalnej",
      signHelp: "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
      signPreview: "Podgląd tabliczki:",
      signEmpty: "Tutaj pojawi się Twoje imię",
      flightNumber: "Numer lotu",
      flightPlaceholder: "np. LO123",
      pickupAddress: "Adres odbioru",
      pickupPlaceholder: "Wpisz pełny adres odbioru",
      passengers: "Liczba pasażerów",
      passengerLabel: (count) => `${count} ${count === 1 ? "osoba" : count < 5 ? "osoby" : "osób"}`,
      passengersBus: ["5 osób", "6 osób", "7 osób", "8 osób"],
      passengersStandard: ["1 osoba", "2 osoby", "3 osoby", "4 osoby"],
      largeLuggage: "Duży bagaż",
      luggageNo: "Nie",
      luggageYes: "Tak",
      contactTitle: "Dane kontaktowe",
      fullName: "Imię i nazwisko",
      namePlaceholder: "Twoje imię i nazwisko",
      phoneNumber: "Numer telefonu",
      email: "Adres e-mail",
      emailPlaceholder: "twoj@email.com",
      emailHelp: "Otrzymasz e-mail z potwierdzeniem i linkiem do edycji lub anulowania",
      notesTitle: "Dodatkowe informacje (opcjonalnie)",
      notesPlaceholder: "Dodatkowe życzenia lub informacje...",
      notesHelp: "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
      submitting: "Wysyłanie...",
      formIncomplete: "Uzupełnij formularz, aby kontynuować",
      missingFields: (fields) => `Uzupełnij proszę: ${fields}.`,
      reassurance: "Bez przedpłaty. Darmowa anulacja. Potwierdzenie w 5–10 min.",
      confirmOrder: (price) => `Potwierdź zamówienie - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Wpisz poprawny numer telefonu (tylko cyfry).",
        phoneLength: "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
        email: "Wpisz poprawny adres e-mail.",
        datePast: "Wybierz dzisiejszą lub przyszłą datę."
      },
      submitError: "Nie udało się wysłać zapytania o wycenę. Spróbuj ponownie.",
      submitNetworkError: "Błąd sieci podczas wysyłania zapytania o wycenę. Spróbuj ponownie.",
      submittedTitle: "Zapytanie o wycenę przyjęte!",
      submittedBody: "Dziękujemy za zgłoszenie. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
      manageLink: "Zarządzaj zamówieniem",
      title: "Poproś o indywidualną wycenę",
      subtitle: "Zaproponuj cenę i otrzymaj odpowiedź w 5–10 minut",
      requestButton: "Zarezerwuj przejazd",
      requestAnother: "Zarezerwuj kolejny przejazd",
      toggleDescription: "Podaj szczegóły przejazdu i zaproponuj cenę. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
      pickupType: "Miejsce odbioru",
      airportPickup: "Odbiór z lotniska",
      addressPickup: "Odbiór z adresu",
      lockMessage: "Wybierz miejsce odbioru, aby odblokować resztę formularza.",
      pickupAddress: "Adres odbioru",
      pickupPlaceholder: "Wpisz pełny adres odbioru (np. Lotnisko Gdańsk, ul. Słowackiego 200)",
      pickupAutoNote: "Adres odbioru z lotniska ustawiany jest automatycznie",
      destinationAddress: "Adres docelowy",
      destinationPlaceholder: "Wpisz adres docelowy (np. Gdańsk Centrum, ul. Długa 1)",
      price: "Cena",
      proposedPriceLabel: "Twoja proponowana cena (PLN)",
      taximeterTitle: "Wpisz adres i poznasz cenę, jeśli Ci nie pasuje - zaproponuj swoją.",
      tariff1: "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
      tariff2: "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
      tariff3: "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
      tariff4: "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
      autoPriceNote: "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
      fixedPriceHint: "Jeśli chcesz zaproponować stałą cenę, kliknij tutaj i wpisz kwotę.",
      pricePlaceholder: "Wpisz swoją ofertę w PLN (np. 150)",
      priceHelp: "Zaproponuj cenę za przejazd. Odpowiemy w 5–10 minut.",
      fixedRouteChecking: "Sprawdzamy, czy ta trasa ma stałą cenę...",
      fixedRouteTitle: "Stała cena dostępna",
      fixedRouteBody: (route, price) => `${route} - stała cena ${price} PLN.`,
      fixedRouteCta: "Zarezerwuj stałą cenę",
      fixedRouteHint: "Skorzystaj z rezerwacji stałej ceny, aby uzyskać najszybsze potwierdzenie.",
      fixedRouteDistance: (distance) => `Dystans trasy: ${distance} km`,
      fixedRouteAllDay: "Stawka całodobowa",
      fixedRouteDay: "Obowiązuje taryfa dzienna",
      fixedRouteNight: "Obowiązuje taryfa nocna",
      fixedRouteLocked: "Ta trasa ma stałą cenę. Zarezerwuj ją przez formularz stałej ceny.",
      fixedRouteComputed: (price) => `Wyliczono stałą cenę: ${price} PLN`,
      fixedRouteFooter: (price) => `Zarezerwuj przejazd - ${price} PLN`,
      longRouteTitle: "Długi dystans - orientacyjna wycena",
      longRouteDistance: (distance) => `Dystans: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Szacunkowa cena standardowa: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Nasza propozycja: ${price} PLN`,
      longRouteSavings: (percent) => `To około ${percent}% mniej niż cena standardowa`,
      longRouteNote: "Możesz nadal zaproponować własną cenę poniżej.",
      date: "Data",
      pickupTime: "Godzina odbioru",
      signServiceTitle: "Odbiór na lotnisku",
      signServiceSign: "Odbiór z kartką",
      signServiceFee: "+20 PLN doliczone do ceny końcowej",
      signServiceSelf: "Znajdę kierowcę samodzielnie na parkingu",
      signServiceSelfNote: "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
      signText: "Tekst na tabliczce",
      signPlaceholder: "Tekst na tabliczce powitalnej",
      signHelp: "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
      signPreview: "Podgląd tabliczki:",
      signEmpty: "Tutaj pojawi się Twoje imię",
      flightNumber: "Numer lotu",
      flightPlaceholder: "np. LO123",
      passengers: "Liczba pasażerów",
      passengersOptions: ["1 osoba", "2 osoby", "3 osoby", "4 osoby", "5+ osób"],
      largeLuggage: "Duży bagaż",
      luggageNo: "Nie",
      luggageYes: "Tak",
      contactTitle: "Dane kontaktowe",
      fullName: "Imię i nazwisko",
      namePlaceholder: "Twoje imię i nazwisko",
      phoneNumber: "Numer telefonu",
      email: "Adres e-mail",
      emailPlaceholder: "twoj@email.com",
      emailHelp: "Otrzymasz odpowiedź w 5–10 minut",
      notesTitle: "Dodatkowe informacje (opcjonalnie)",
      notesPlaceholder: "Dodatkowe życzenia lub informacje...",
      notesHelp: "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
      submitting: "Wysyłanie...",
      formIncomplete: "Uzupełnij formularz, aby kontynuować",
      missingFields: (fields) => `Uzupełnij proszę: ${fields}.`,
      submit: "Zarezerwuj przejazd"
    },
    manageOrder: {
      errors: {
        load: "Nie udało się wczytać zamówienia.",
        loadNetwork: "Błąd sieci podczas wczytywania zamówienia.",
        save: "Nie udało się zapisać zmian.",
        saveNetwork: "Błąd sieci podczas zapisywania zmian.",
        cancel: "Nie udało się anulować zamówienia.",
        cancelNetwork: "Błąd sieci podczas anulowania zamówienia.",
        copySuccess: "Skopiowano do schowka",
        copyFail: "Nie udało się skopiować do schowka",
        emailRequired: "Podaj adres e-mail."
      },
      loading: "Ładowanie zamówienia...",
      accessTitle: "Dostęp do rezerwacji",
      accessBody: "Podaj adres e-mail użyty podczas rezerwacji, aby zobaczyć szczegóły zamówienia.",
      accessPlaceholder: "you@example.com",
      accessAction: "Kontynuuj",
      accessChecking: "Sprawdzanie...",
      cancelledTitle: "Zamówienie anulowane",
      cancelledBody: "Twoje zamówienie zostało anulowane. Jeśli to pomyłka, utwórz nową rezerwację.",
      manageTitle: "Zarządzaj transferem",
      copyAction: "Kopiuj",
      orderLabel: "Nr zamówienia",
      orderIdLabel: "ID zamówienia",
      detailsUpdatedTitle: "Dane zaktualizowane",
      detailsUpdatedBody: (date, time) => `Dziękujemy! Twoje dane zostały zaktualizowane. Transfer pozostaje potwierdzony na ${date} o ${time}. Do zobaczenia.`,
      updateSubmittedTitle: "Aktualizacja wysłana",
      updateSubmittedBody: "Twoja prośba o aktualizację została wysłana. Wkrótce odpowiemy.",
      awaiting: "Oczekiwanie na potwierdzenie...",
      transferRoute: "Trasa przejazdu",
      priceLabel: "Cena:",
      pricePending: "Cena ustalana indywidualnie",
      taximeterTitle: "Kwota liczona wg taksometru",
      taximeterRates: "Stawki taksometru",
      tariff1: "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
      tariff2: "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
      tariff3: "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
      tariff4: "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
      statusConfirmed: "Potwierdzone",
      statusCompleted: "Zrealizowane",
      statusFailed: "Nie zrealizowane",
      statusRejected: "Odrzucone",
      statusPriceProposed: "Zaproponowana cena",
      statusPending: "Oczekujące",
      bookingDetails: "Szczegóły rezerwacji",
      editDetails: "Edytuj dane",
      updateRequested: "Zaktualizuj wskazane pola",
      confirmedEditNote: "Edycja potwierdzonego zamówienia wyśle je do ponownej akceptacji. Otrzymasz nowe potwierdzenie e-mailem.",
      updateFieldsNote: "Zaktualizuj podświetlone pola i zapisz zmiany.",
      confirmedNote: "To zamówienie zostało potwierdzone.",
      completedNote: "To zamówienie zostało oznaczone jako zrealizowane.",
      failedNote: "To zamówienie zostało oznaczone jako niezrealizowane.",
      priceProposedNote: "Zaproponowano nową cenę. Sprawdź e-mail, aby ją zaakceptować lub odrzucić.",
      rejectedNote: "To zamówienie zostało odrzucone. Edycja jest wyłączona, ale możesz anulować rezerwację.",
      rejectionReasonLabel: "Powód:",
      date: "Data",
      pickupTime: "Godzina odbioru",
      signServiceTitle: "Odbiór na lotnisku",
      signServiceSign: "Odbiór z kartką",
      signServiceFee: "+20 PLN doliczone do ceny końcowej",
      signServiceSelf: "Znajdę kierowcę samodzielnie na parkingu",
      signServiceSelfNote: "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
      signText: "Tekst na tabliczce",
      flightNumber: "Numer lotu",
      pickupAddress: "Adres odbioru",
      passengers: "Liczba pasażerów",
      passengersBus: ["5 osób", "6 osób", "7 osób", "8 osób"],
      passengersStandard: ["1 osoba", "2 osoby", "3 osoby", "4 osoby"],
      largeLuggage: "Duży bagaż",
      luggageNo: "Nie",
      luggageYes: "Tak",
      contactTitle: "Dane kontaktowe",
      fullName: "Imię i nazwisko",
      phoneNumber: "Numer telefonu",
      email: "Adres e-mail",
      notesTitle: "Dodatkowe informacje (opcjonalnie)",
      saveChanges: "Zapisz zmiany",
      cancelEdit: "Anuluj",
      editBooking: "Edytuj rezerwację",
      cancelBooking: "Anuluj rezerwację",
      changesNotice: "Zmiany w rezerwacji potwierdzimy e-mailem. W pilnych sprawach skontaktuj się z nami pod adresem booking@taxiairportgdansk.com",
      updateRequestNote: "Twoja rezerwacja została zaktualizowana. Sprawdź i potwierdź zmiany.",
      rejectNote: "Rezerwacja została odrzucona. Skontaktuj się z obsługą, jeśli masz pytania.",
      cancelPromptTitle: "Anulować rezerwację?",
      cancelPromptBody: "Czy na pewno chcesz anulować tę rezerwację? Tej operacji nie można cofnąć.",
      confirmCancel: "Tak, anuluj",
      keepBooking: "Zachowaj rezerwację",
      copyOrderLabel: "Nr zamówienia",
      copyOrderIdLabel: "ID zamówienia"
    },
    adminOrders: {
      title: "Zamówienia (admin)",
      subtitle: "Wszystkie ostatnie zamówienia i statusy.",
      loading: "Ładowanie zamówień...",
      missingToken: "Brak tokenu admina.",
      errorLoad: "Nie udało się wczytać zamówień.",
      filters: {
        all: "Wszystkie",
        active: "W toku",
        completed: "Zrealizowane",
        failed: "Niezrealizowane",
        rejected: "Odrzucone"
      },
      statuses: {
        pending: "Oczekujące",
        confirmed: "Potwierdzone",
        price_proposed: "Zaproponowana cena",
        completed: "Zrealizowane",
        failed: "Niezrealizowane",
        rejected: "Odrzucone"
      },
      columns: {
        order: "Zamówienie",
        pickup: "Odbiór",
        customer: "Klient",
        price: "Cena",
        status: "Status",
        open: "Otwórz"
      },
      empty: "Brak zamówień.",
      pendingPrice: (price) => `Oczekuje: ${price} PLN`,
      view: "Podgląd"
    },
    adminOrder: {
      title: "Szczegóły zamówienia (admin)",
      subtitle: "Zarządzaj, potwierdź lub odrzuć zamówienie.",
      back: "Wróć do listy zamówień",
      loading: "Ładowanie zamówienia...",
      missingToken: "Brak tokenu admina.",
      errorLoad: "Nie udało się wczytać zamówienia.",
      updated: "Zamówienie zaktualizowane.",
      updateError: "Nie udało się zaktualizować zamówienia.",
      statusUpdated: "Status zamówienia zaktualizowany.",
      updateRequestSent: "Wysłano prośbę o aktualizację do klienta.",
      updateRequestError: "Nie udało się wysłać prośby o aktualizację.",
      updateRequestSelect: "Wybierz co najmniej jedno pole do aktualizacji.",
      orderLabel: "Zamówienie",
      idLabel: "ID",
      customerLabel: "Klient",
      pickupLabel: "Odbiór",
      priceLabel: "Cena",
      pendingPrice: (price) => `Oczekuje: ${price} PLN`,
      additionalInfo: "Dodatkowe informacje",
      passengers: "Pasażerowie:",
      largeLuggage: "Duży bagaż:",
      pickupType: "Miejsce odbioru:",
      signService: "Opcja odbioru:",
      signServiceSign: "Odbiór z kartką",
      signServiceSelf: "Samodzielne znalezienie kierowcy",
      signFee: "Dopłata za kartkę:",
      flightNumber: "Numer lotu:",
      signText: "Tekst na tabliczce:",
      route: "Trasa:",
      notes: "Uwagi:",
      adminActions: "Akcje admina",
      confirmOrder: "Potwierdź zamówienie",
      rejectOrder: "Odrzuć zamówienie",
      proposePrice: "Zaproponuj nową cenę (PLN)",
      sendPrice: "Wyślij propozycję ceny",
      rejectionReason: "Powód odrzucenia (opcjonalnie)",
      requestUpdate: "Poproś o aktualizację danych",
      requestUpdateBody: "Wybierz pola do aktualizacji. Klient otrzyma e-mail z linkiem do edycji.",
      fieldPhone: "Numer telefonu",
      fieldEmail: "Adres e-mail",
      fieldFlight: "Numer lotu",
      requestUpdateAction: "Wyślij prośbę",
      cancelConfirmedTitle: "Anulowanie potwierdzonego zamówienia",
      cancelConfirmedBody: "Wyślij klientowi e-mail o anulowaniu z powodu braku dostępności taksówek w wybranym czasie.",
      cancelConfirmedAction: "Anuluj potwierdzone zamówienie",
      cancelConfirmedConfirm: "Czy na pewno anulować to potwierdzone zamówienie i powiadomić klienta?",
      cancelConfirmedSuccess: "Zamówienie anulowane.",
      deleteRejectedTitle: "Usuń odrzucone zamówienie",
      deleteRejectedBody: "Usuń to odrzucone zamówienie na stałe.",
      deleteRejectedAction: "Usuń odrzucone zamówienie",
      deleteRejectedConfirm: "Czy na pewno usunąć to odrzucone zamówienie?",
      deleteRejectedSuccess: "Zamówienie usunięte.",
      completionTitle: "Status realizacji",
      markCompleted: "Zrealizowane",
      markCompletedConfirm: "Oznaczyć to zamówienie jako zrealizowane?",
      markFailed: "Niezrealizowane",
      markFailedConfirm: "Oznaczyć to zamówienie jako niezrealizowane?"
    },
    pages: {
      gdanskTaxi: {
        title: "Taxi z lotniska Gdańsk",
        description: "Zarezerwuj szybki i niezawodny transfer z Lotniska Gdańsk. Stałe ceny w obie strony, profesjonalni kierowcy i szybkie potwierdzenie.",
        route: "Lotnisko Gdańsk",
        examples: ["Gdańsk Stare Miasto", "Gdańsk Oliwa", "Dworzec Główny", "Plaża w Brzeźnie"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Transfer Lotnisko Gdańsk – Sopot",
        description: "Prywatny transfer między Lotniskiem Gdańsk a Sopotem ze stałą ceną w obie strony i śledzeniem lotu.",
        route: "Lotnisko Gdańsk ↔ Sopot",
        examples: ["Molo w Sopocie", "Centrum Sopotu", "Hotele w Sopocie", "Dworzec Sopot"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Transfer Lotnisko Gdańsk – Gdynia",
        description: "Komfortowy transfer między Lotniskiem Gdańsk a Gdynią ze stałą ceną w obie strony.",
        route: "Lotnisko Gdańsk ↔ Gdynia",
        examples: ["Centrum Gdyni", "Port Gdynia", "Hotele w Gdyni", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  },
  de: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Preis prüfen und TAXI buchen",
      orderNow: "Jetzt reservieren",
      close: "Schließen",
      noPrepayment: "Keine Vorauszahlung",
      backToHome: "← Zurück zur Startseite",
      notFoundTitle: "Seite nicht gefunden",
      notFoundBody: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      notFoundCta: "Zur Startseite",
      notFoundSupport: "Wenn das ein Fehler ist, kontaktieren Sie uns:",
      notFoundRequested: "Angeforderte URL",
      notFoundPopular: "Beliebte Seiten",
      actualBadge: "AKTUELL",
      priceFrom: "ab",
      perNight: "nachts",
      perDay: "in die Innenstadt (Tag)",
      whatsappMessage: "Hallo Taxi Airport Gdańsk, ich möchte einen Transfer buchen."
    },
    navbar: {
      home: "Start",
      fleet: "Unsere Flotte",
      airportTaxi: "Gdańsk Flughafen Taxi",
      airportSopot: "Flughafen ↔ Sopot",
      airportGdynia: "Flughafen ↔ Gdynia",
      prices: "Preise",
      orderNow: "JETZT RESERVIEREN",
      language: "Sprache"
    },
    hero: {
      promo: {
        dayPrice: "NUR 100 PLN",
        dayLabel: "in die Innenstadt (Tag)",
        nightPrice: "120 PLN",
        nightLabel: "nachts"
      },
      logoAlt: "Taxi Airport Gdańsk - Flughafentransfer & Limousinenservice",
      orderViaEmail: "Per E-Mail bestellen",
      headline: "Gdańsk Flughafen Taxi – Transfers für Gdańsk, Sopot & Gdynia",
      subheadline: "Gdansk airport taxi mit Festpreisen, 24/7 Service und schneller Bestätigung.",
      whyChoose: "Warum Taxi Airport Gdańsk",
      benefits: "Vorteile",
      benefitsList: {
        flightTrackingTitle: "Flugverfolgung",
        flightTrackingBody: "Wir überwachen Ankünfte und passen die Abholzeit automatisch an.",
        meetGreetTitle: "Meet & Greet",
        meetGreetBody: "Professionelle Fahrer, klare Kommunikation und Hilfe mit Gepäck.",
        fastConfirmationTitle: "Schnelle Bestätigung",
        fastConfirmationBody: "Die meisten Buchungen werden innerhalb von 5–10 Minuten bestätigt.",
        flexiblePaymentsTitle: "Flexible Zahlungen",
        flexiblePaymentsBody: "Karte, Apple Pay, Google Pay, Revolut oder bar.",
        freePrebookingTitle: "Kostenlose Vorbuchung",
        freePrebookingBody: "Jederzeit kostenlos stornierbar. Voll automatisiert.",
        fixedPriceTitle: "Festpreisgarantie",
        fixedPriceBody: "Festpreis in beide Richtungen. Der gebuchte Preis ist der Endpreis.",
        localExpertiseTitle: "Lokale Expertise",
        localExpertiseBody: "Erfahrene Dreistadt-Fahrer mit den schnellsten Routen.",
        assistanceTitle: "24/7 Unterstützung",
        assistanceBody: "Immer erreichbar vor, während und nach der Fahrt."
      },
      fleetTitle: "Unsere Flotte",
      fleetLabel: "Fahrzeuge",
      standardCarsTitle: "Standardfahrzeuge",
      standardCarsBody: "1-4 Passagiere | Komfortable Limousinen und SUVs",
      busTitle: "Und mehr Busse",
      busBody: "5-8 Passagiere | Perfekt für größere Gruppen"
    },
    vehicle: {
      title: "Wählen Sie Ihr Fahrzeug",
      subtitle: "Wählen Sie den Fahrzeugtyp passend zur Gruppengröße",
      standardTitle: "Standardwagen",
      standardPassengers: "1-4 Passagiere",
      standardDescription: "Perfekt für Einzelpersonen, Paare und kleine Familien",
      busTitle: "BUS Service",
      busPassengers: "5-8 Passagiere",
      busDescription: "Ideal für größere Gruppen und Familien mit mehr Gepäck",
      examplePrices: "Beispielpreise:",
      airportGdansk: "Flughafen ↔ Gdańsk",
      airportSopot: "Flughafen ↔ Sopot",
      airportGdynia: "Flughafen ↔ Gdynia",
      selectStandard: "Standardwagen wählen",
      selectBus: "BUS Service wählen"
    },
    pricing: {
      back: "Zurück zur Fahrzeugauswahl",
      titleStandard: "Standardwagen (1-4 Passagiere)",
      titleBus: "BUS Service (5-8 Passagiere)",
      description: "Festpreise in beide Richtungen (zum und vom Flughafen). Keine versteckten Gebühren. Nachttarif gilt von 22–6 Uhr sowie an Sonntagen und Feiertagen.",
      dayRate: "Tagtarif",
      nightRate: "Nachttarif",
      sundayNote: "(Sonntage & Feiertage)",
      customRouteTitle: "Individuelle Route",
      customRouteBody: "Brauchen Sie ein anderes Ziel?",
      customRoutePrice: "Festpreise",
      customRoutePriceBody: "Flexible Preise je nach Strecke",
      customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
      requestQuote: "Jetzt reservieren",
      pricesNote: "Preise inkl. MwSt. Weitere Ziele auf Anfrage.",
      tableTitle: "Preistabelle",
      tableRoute: "Strecke",
      tableStandardDay: "Standard Tag",
      tableStandardNight: "Standard Nacht",
      tableBusDay: "Bus Tag",
      tableBusNight: "Bus Nacht",
      tariffsTitle: "Individuelle Streckenpreise",
      tariffsName: "Tarif",
      tariffsRate: "Satz",
      bookingTitle: "Transfer buchen",
      bookingSubtitle: "Fahrzeugtyp wählen und Fahrt sofort reservieren.",
      routes: {
        airport: "Flughafen",
        gdansk: "Gdańsk Zentrum",
        gdynia: "Gdynia Zentrum"
      }
    },
    pricingLanding: {
      title: "Preise Taxi Flughafen Gdańsk",
      subtitle: "Festpreise für Flughafentransfers und transparente Preise für individuelle Strecken.",
      description: "Vergleichen Sie Standard- und Buspreise und buchen Sie sofort oder fordern Sie ein Angebot an.",
      cta: "Transfer buchen",
      calculatorCta: "Rechner",
      highlights: [
        {
          title: "Festpreise in beide Richtungen",
          body: "Die gelisteten Flughafenrouten haben feste Preise ohne versteckte Gebühren."
        },
        {
          title: "24/7 verfügbar",
          body: "Täglich verfügbar mit schneller Bestätigung und Support."
        },
        {
          title: "Busservice für Gruppen",
          body: "Geräumige 5–8-Sitzer für Familien und größere Gruppen."
        }
      ],
      faqTitle: "Preis-FAQ",
      faq: [
        {
          question: "Sind diese Preise fest?",
          answer: "Ja. Flughafenrouten haben feste Preise in beide Richtungen. Individuelle Strecken werden individuell bepreist."
        },
        {
          question: "Wann gilt der Nachttarif?",
          answer: "Von 22:00 bis 6:00 sowie an Sonn- und Feiertagen."
        },
        {
          question: "Überwacht ihr Flugverspätungen?",
          answer: "Ja, wir verfolgen Ankünfte und passen die Abholzeit automatisch an."
        },
        {
          question: "Kann ich mit Karte zahlen?",
          answer: "Kartenzahlung auf Anfrage. Rechnungen für Geschäftskunden verfügbar."
        }
      ]
    },
    pricingCalculator: {
      title: "Preisrechner",
      subtitle: "Geben Sie Abholung und Ziel ein, um den Preis zu schätzen.",
      airportLabel: "Flughafen Gdańsk",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Abholung von Adresse",
      destinationCustomLabel: "Zieladresse",
      pickupLabel: "Abholort",
      pickupPlaceholder: "z.B. Flughafen Gdańsk, Słowackiego 200",
      destinationLabel: "Zielort",
      destinationPlaceholder: "z.B. Sopot, Monte Cassino 1",
      distanceLabel: "Entfernung",
      resultsTitle: "Preis-Schätzung",
      fixedAllDay: "Ganztagstarif",
      dayRate: "Tagtarif",
      nightRate: "Nachttarif",
      dayRateLabel: "Tagessatz",
      allDayRateLabel: "Ganztagessatz",
      guaranteedPriceLabel: "Garantierter Preis",
      standard: "Standard",
      bus: "Bus",
      loading: "Route wird berechnet...",
      noResult: "Diese Route konnte nicht berechnet werden. Bitte Adresse präzisieren.",
      longRouteTitle: "Schätzung für lange Strecken",
      taximeterLabel: "Taxameter",
      proposedLabel: "Vorgeschlagener Preis",
      savingsLabel: "Ersparnis",
      orderNow: "Jetzt buchen",
      note: "Preise sind fest. Sie können im Formular für eine andere Strecke einen anderen Preis vorschlagen."
    },
    trust: {
      companyTitle: "Unternehmensdaten",
      paymentTitle: "Zahlung & Rechnungen",
      comfortTitle: "Komfort & Sicherheit",
      paymentBody: "Bar oder Karte auf Anfrage. Rechnungen für Geschäftskunden verfügbar.",
      comfortBody: "Kindersitze auf Anfrage. Professionelle, lizenzierte Fahrer und Tür-zu-Tür-Service."
    },
    footer: {
      description: "Professioneller Flughafentransfer in der Dreistadt. Rund um die Uhr verfügbar.",
      contactTitle: "Kontakt",
      location: "Gdańsk, Polen",
      bookingNote: "Online, per WhatsApp oder E-Mail buchen",
      hoursTitle: "Servicezeiten",
      hoursBody: "24/7 - täglich verfügbar",
      hoursSub: "Flughafenabholungen, City-Transfers und individuelle Routen",
      routesTitle: "Beliebte Routen",
      rights: "Alle Rechte vorbehalten.",
      cookiePolicy: "Cookie-Richtlinie",
      privacyPolicy: "Datenschutz"
    },
    cookieBanner: {
      title: "Cookie-Einstellungen",
      body: "Wir verwenden essentielle Cookies, um den Buchungsprozess sicher und zuverlässig zu halten. Mit Ihrer Zustimmung nutzen wir auch Marketing-Cookies, um Anzeigen-Konversionen zu messen und Angebote zu verbessern. Sie können Ihre Auswahl jederzeit durch Löschen des Browser-Speichers ändern.",
      readPolicy: "Richtlinie lesen",
      decline: "Ablehnen",
      accept: "Cookies akzeptieren"
    },
    cookiePolicy: {
      title: "Cookie-Richtlinie",
      updated: "Zuletzt aktualisiert: 2. Januar 2026",
      intro: "Diese Website verwendet Cookies, um zuverlässig zu funktionieren und Ihre Buchung sicher zu halten. Mit Ihrer Zustimmung verwenden wir auch Marketing-Cookies, um Konversionen zu messen.",
      sectionCookies: "Welche Cookies wir verwenden",
      cookiesList: [
        "Essentielle Cookies zur Sicherheit der Website und zur Missbrauchsprävention.",
        "Präferenz-Cookies, um grundlegende Einstellungen während einer Sitzung zu merken.",
        "Marketing-Cookies zur Messung von Konversionen aus Anzeigen (Google Ads)."
      ],
      sectionManage: "So können Sie Cookies verwalten",
      manageBody1: "Sie können Cookies jederzeit in den Browser-Einstellungen löschen. Das Blockieren essentieller Cookies kann die Buchung und Verwaltung beeinträchtigen.",
      manageBody2: "Sie können Ihre Marketing-Cookie-Einstellung auch ändern, indem Sie den Browser-Speicher löschen und die Website erneut besuchen.",
      contact: "Kontakt",
      contactBody: "Wenn Sie Fragen zu dieser Richtlinie haben, kontaktieren Sie uns unter"
    },
    privacyPolicy: {
      title: "Datenschutz",
      updated: "Zuletzt aktualisiert: 2. Januar 2026",
      intro: "Diese Datenschutzerklärung erklärt, wie Taxi Airport Gdańsk personenbezogene Daten verarbeitet, wenn Sie unsere Dienste nutzen.",
      controllerTitle: "Verantwortlicher",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Polen\nE-Mail:",
      dataTitle: "Welche Daten wir erheben",
      dataList: [
        "Kontaktdaten wie Name, E-Mail-Adresse und Telefonnummer.",
        "Buchungsdaten wie Abholort, Datum, Uhrzeit, Flugnummer und Hinweise.",
        "Technische Daten wie IP-Adresse und grundlegende Browserinformationen zur Sicherheit."
      ],
      whyTitle: "Warum wir Ihre Daten verarbeiten",
      whyList: [
        "Um Ihre Buchungsanfrage zu bearbeiten und den Service zu erbringen.",
        "Um über Buchungen, Änderungen oder Stornierungen zu kommunizieren.",
        "Zur Erfüllung gesetzlicher Pflichten und zur Missbrauchsprävention."
      ],
      legalTitle: "Rechtsgrundlage",
      legalList: [
        "Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).",
        "Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO).",
        "Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO), z. B. Sicherheit und Betrugsprävention."
      ],
      storageTitle: "Wie lange wir Daten speichern",
      storageBody: "Wir speichern Buchungsdaten nur so lange, wie es für die Leistungserbringung und gesetzliche Anforderungen notwendig ist.",
      shareTitle: "Mit wem wir Daten teilen",
      shareBody: "Wir teilen Daten nur mit Dienstleistern, die für die Buchung erforderlich sind (z. B. E-Mail-Dienste). Wir verkaufen keine personenbezogenen Daten.",
      rightsTitle: "Ihre Rechte",
      rightsList: [
        "Auskunft, Berichtigung oder Löschung Ihrer personenbezogenen Daten.",
        "Einschränkung oder Widerspruch gegen die Verarbeitung.",
        "Datenübertragbarkeit, sofern anwendbar.",
        "Beschwerderecht bei einer Aufsichtsbehörde."
      ],
      contactTitle: "Kontakt",
      contactBody: "Für Datenschutzanfragen kontaktieren Sie uns unter"
    },
    routeLanding: {
      orderNow: "Jetzt online reservieren",
      quickLinks: "Quick links",
      pricingLink: "Preise ansehen",
      orderLinks: {
        airportGdansk: "Book airport → Gdańsk",
        airportSopot: "Book airport → Sopot",
        airportGdynia: "Book airport → Gdynia",
        custom: "Custom route"
      },
      seoParagraph: (route) => `Gdansk airport taxi für die Strecke ${route}. Festpreise, 24/7 Service, Meet & Greet und schnelle Bestätigung.`,
      pricingTitle: "Beispielpreise",
      pricingSubtitle: (route) => `Standardwagen für ${route}`,
      vehicleLabel: "Standardwagen",
      dayLabel: "Tagestarif",
      nightLabel: "Nachttarif",
      currency: "PLN",
      pricingNote: "Preise inkl. MwSt. Nachttarif gilt von 22:00 bis 6:00 sowie an Sonn- und Feiertagen.",
      includedTitle: "Was ist enthalten",
      includedList: [
        "Meet & Greet am Flughafen mit klaren Abholhinweisen.",
        "Flugverfolgung und flexible Abholzeit.",
        "Festpreise in beide Richtungen ohne versteckte Gebühren.",
        "Professionelle, englischsprachige Fahrer."
      ],
      destinationsTitle: "Beliebte Ziele",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Wie schnell ist die Bestätigung?",
          answer: "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
        },
        {
          question: "Verfolgen Sie Flüge?",
          answer: "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
        },
        {
          question: "Kann ich stornieren?",
          answer: "Sie können über den Link in Ihrer Bestätigungs-E-Mail stornieren."
        },
        {
          question: "Bieten Sie Kindersitze an?",
          answer: "Ja, Kindersitze sind auf Anfrage bei der Buchung verfügbar."
        },
        {
          question: "Wie kann ich bezahlen?",
          answer: "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder bar auf Anfrage."
        },
        {
          question: "Wo treffe ich den Fahrer?",
          answer: "Sie erhalten klare Abholhinweise und Kontaktdaten in der Bestätigungs-E-Mail."
        }
      ]
    },
    countryLanding: {
      title: "Flughafentransfer Gdańsk für Reisende aus Deutschland",
      description: "Privater Transfer ab Flughafen Gdańsk mit Festpreisen, 24/7 Abholung und englischsprachigen Fahrern.",
      intro: "Ideal für Flüge aus Deutschland zum Flughafen Gdańsk (GDN). Online buchen und schnelle Bestätigung per E-Mail.",
      ctaPrimary: "Transfer buchen",
      ctaSecondary: "Preise ansehen",
      highlightsTitle: "Warum Reisende aus Deutschland uns wählen",
      highlights: [
        "Festpreise in PLN ohne versteckte Gebühren.",
        "Meet & greet am Terminal mit klaren Abholhinweisen.",
        "Flugverfolgung und flexible Abholzeit.",
        "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder auf Wunsch bar."
      ],
      airportsTitle: "Häufige Abflugorte (Deutschland)",
      airports: [
        "Dortmund (DTM)",
        "Frankfurt (FRA)",
        "Hamburg (HAM)",
        "München (MUC)"
      ],
      faqTitle: "FAQ für Reisende aus Deutschland",
      faq: [
        {
          question: "Kann ich in EUR bezahlen?",
          answer: "Die Preise sind in PLN. Kartenzahlungen werden automatisch von Ihrer Bank umgerechnet."
        },
        {
          question: "Stellen Sie Belege oder Rechnungen aus?",
          answer: "Ja, geben Sie dies bei der Buchung an und wir senden den Beleg per E-Mail."
        },
        {
          question: "Wie schnell ist die Bestätigung?",
          answer: "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
        },
        {
          question: "Verfolgen Sie Flüge?",
          answer: "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Gdańsk Flughafentransfer (${airport})`,
      description: (city, airport) => `Privater Transfer von ${airport} nach Gdańsk, Sopot und Gdynia mit Festpreisen und 24/7 Abholung.`,
      intro: (city, airport) => `Direktflüge von ${airport} nach Gdańsk sind saisonal. Buchen Sie den Transfer im Voraus.`,
      ctaPrimary: "Transfer buchen",
      ctaSecondary: "Preise ansehen",
      highlightsTitle: "Warum im Voraus buchen",
      highlights: [
        "Meet & greet am Terminal mit klaren Abholhinweisen.",
        "Flugverfolgung und flexible Abholzeit.",
        "Festpreise in PLN ohne versteckte Gebühren.",
        "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder auf Wunsch bar."
      ],
      routeTitle: (airport) => `Von ${airport} nach Gdańsk`,
      routeBody: (airport) => `Wir holen Ankünfte von ${airport} ab und fahren Sie nach Gdańsk, Sopot und Gdynia.`,
      destinationsTitle: "Beliebte Ziele in der Dreistadt",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Gibt es Direktflüge von {city} nach Gdańsk?",
          answer: "Direktflüge sind saisonal. Bitte prüfen Sie den aktuellen Flugplan vor der Reise."
        },
        {
          question: "Wie treffe ich den Fahrer?",
          answer: "Sie erhalten Abholhinweise und Kontaktdaten in der Bestätigungs-E-Mail."
        },
        {
          question: "Ist Flugverfolgung inklusive?",
          answer: "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
        },
        {
          question: "Kann ich mit Karte zahlen?",
          answer: "Ja, Kartenzahlung ist möglich. Barzahlung auf Wunsch."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Festpreise und 24/7 Verfügbarkeit.",
      intro: "Taxi Gdańsk für Flughafentransfers und Stadtfahrten. Professionelle Fahrer, schnelle Bestätigung und klare Preise.",
      ctaPrimary: "Taxi buchen",
      ctaSecondary: "Preise ansehen",
      highlightsTitle: "Warum mit uns fahren",
      highlights: [
        "Festpreise ohne versteckte Gebühren.",
        "24/7 Verfügbarkeit für Flughafen- und Stadtfahrten.",
        "Flugverfolgung und flexible Abholzeit.",
        "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder bar auf Wunsch."
      ],
      serviceAreaTitle: "Servicegebiet",
      serviceArea: [
        "Gdańsk Altstadt und Zentrum",
        "Gdańsk Wrzeszcz und Oliwa",
        "Flughafen Gdańsk (GDN)",
        "Sopot und Gdynia"
      ],
      routesTitle: "Beliebte Taxi-Strecken",
      routes: [
        "Flughafen Gdańsk → Altstadt",
        "Flughafen Gdańsk → Sopot",
        "Flughafen Gdańsk → Gdynia",
        "Altstadt → Flughafen Gdańsk"
      ],
      cityRoutesTitle: "Taxipreise ab Flughafen Gdańsk",
      cityRoutesDescription: "Prüfe den aktuellen Preis vom Flughafen Gdańsk zu diesen Orten.",
      cityRoutesItem: (destination) => `Taxi-Preis vom Flughafen Gdańsk nach ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Wie schnell ist die Bestätigung?",
          answer: "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
        },
        {
          question: "Bieten Sie Festpreise an?",
          answer: "Ja, Flughafentransfers haben feste Preise in beide Richtungen."
        },
        {
          question: "Kann ich mit Karte zahlen?",
          answer: "Ja, Kartenzahlung ist möglich. Barzahlung auf Wunsch."
        },
        {
          question: "Verfolgen Sie Flüge?",
          answer: "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Bitte geben Sie eine gültige Telefonnummer ein (nur Ziffern).",
        phoneLength: "Bitte geben Sie eine gültige Telefonnummer ein (7–15 Ziffern, optional +).",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        datePast: "Bitte wählen Sie ein heutiges oder zukünftiges Datum."
      },
      rate: {
        day: "Tagtarif",
        night: "Nachttarif",
        reasonDay: "Standard-Tagtarif",
        reasonLate: "Abholung nach 21:30 oder vor 5:30",
        reasonHoliday: "Sonntag/Feiertag",
        banner: (label, price, reason) => `Angewandt ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Bestellung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      submitNetworkError: "Netzwerkfehler beim Senden der Bestellung. Bitte versuchen Sie es erneut.",
      submittedTitle: "Bestellung erhalten",
      submittedBody: "Danke! Ihre Anfrage ist in der Warteschlange. Bitte warten Sie auf die Bestätigung – normalerweise 5–10 Minuten. Sie erhalten in Kürze eine Bestätigungs-E-Mail.",
      awaiting: "Warten auf Bestätigung...",
      totalPrice: "Gesamtpreis:",
      orderNumber: "Bestellnummer:",
      orderId: "Bestell-ID:",
      manageLink: "Bestellung verwalten oder bearbeiten",
      title: "Transfer bestellen",
      date: "Datum",
      pickupTime: "Abholzeit",
      pickupType: "Abholart",
      pickupTypeHint: "Wählen Sie die Abholart, um fortzufahren.",
      airportPickup: "Flughafenabholung",
      addressPickup: "Abholung an Adresse",
      signServiceTitle: "Abholung am Flughafen",
      signServiceSign: "Abholung mit Namensschild",
      signServiceFee: "+20 PLN zum Endpreis",
      signServiceSelf: "Fahrer selbst auf dem Parkplatz finden",
      signServiceSelfNote: "Der Fahrer kontaktiert dich per WhatsApp oder telefonisch und ihr trefft euch.",
      signText: "Text für Namensschild",
      signPlaceholder: "Text für das Abholschild",
      signHelp: "Der Fahrer wartet mit einem Schild, bis Sie die Ankunftshalle verlassen.",
      signPreview: "Schildvorschau:",
      signEmpty: "Ihr Name erscheint hier",
      flightNumber: "Flugnummer",
      flightPlaceholder: "z. B. LO123",
      pickupAddress: "Abholadresse",
      pickupPlaceholder: "Vollständige Abholadresse eingeben",
      passengers: "Anzahl der Passagiere",
      passengerLabel: (count) => `${count} ${count === 1 ? "Person" : "Personen"}`,
      passengersBus: ["5 Personen", "6 Personen", "7 Personen", "8 Personen"],
      passengersStandard: ["1 Person", "2 Personen", "3 Personen", "4 Personen"],
      largeLuggage: "Großes Gepäck",
      luggageNo: "Nein",
      luggageYes: "Ja",
      contactTitle: "Kontaktdaten",
      fullName: "Vollständiger Name",
      namePlaceholder: "Ihr Name",
      phoneNumber: "Telefonnummer",
      email: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.com",
      emailHelp: "Sie erhalten eine Bestätigungs-E-Mail mit einem Link zum Bearbeiten oder Stornieren",
      notesTitle: "Zusätzliche Hinweise (optional)",
      notesPlaceholder: "Besondere Wünsche oder zusätzliche Informationen...",
      notesHelp: "Z. B. Kindersitz erforderlich, Wartezeit, besondere Anweisungen",
      submitting: "Wird gesendet...",
      formIncomplete: "Formular ausfüllen, um fortzufahren",
      missingFields: (fields) => `Bitte ausfüllen: ${fields}.`,
      reassurance: "Keine Vorauszahlung. Kostenlose Stornierung. Bestätigung in 5–10 Min.",
      confirmOrder: (price) => `Bestellung bestätigen - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Bitte geben Sie eine gültige Telefonnummer ein (nur Ziffern).",
        phoneLength: "Bitte geben Sie eine gültige Telefonnummer ein (7–15 Ziffern, optional +).",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        datePast: "Bitte wählen Sie ein heutiges oder zukünftiges Datum."
      },
      submitError: "Angebotsanfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      submitNetworkError: "Netzwerkfehler beim Senden der Angebotsanfrage. Bitte versuchen Sie es erneut.",
      submittedTitle: "Angebotsanfrage erhalten!",
      submittedBody: "Vielen Dank. Sie erhalten innerhalb von 5-10 Minuten eine E-Mail, ob Ihr Angebot angenommen oder abgelehnt wurde.",
      manageLink: "Ihre Bestellung verwalten",
      title: "Individuelles Angebot anfordern",
      subtitle: "Schlagen Sie Ihren Preis vor und erhalten Sie in 5-10 Minuten eine Antwort",
      requestButton: "Angebot anfordern",
      requestAnother: "Weiteres Angebot anfordern",
      toggleDescription: "Geben Sie Ihre Fahrtdetails an und schlagen Sie Ihren Preis vor. Sie erhalten in 5-10 Minuten eine Antwort per E-Mail.",
      pickupType: "Abholart",
      airportPickup: "Flughafenabholung",
      addressPickup: "Abholung an Adresse",
      lockMessage: "Wählen Sie eine Abholart, um den Rest des Formulars freizuschalten.",
      pickupAddress: "Abholadresse",
      pickupPlaceholder: "Vollständige Abholadresse eingeben (z. B. Gdańsk Airport, ul. Słowackiego 200)",
      pickupAutoNote: "Die Abholadresse am Flughafen wird automatisch gesetzt",
      destinationAddress: "Zieladresse",
      destinationPlaceholder: "Zieladresse eingeben (z. B. Gdańsk Centrum, ul. Długa 1)",
      price: "Preis",
      proposedPriceLabel: "Ihr Preisvorschlag (PLN)",
      taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
      tariff1: "Tarif 1 (Stadt, 6–22): 3.90 PLN/km.",
      tariff2: "Tarif 2 (Stadt, 22–6): 5.85 PLN/km.",
      tariff3: "Tarif 3 (außerhalb, 6–22): 7.80 PLN/km.",
      tariff4: "Tarif 4 (außerhalb, 22–6): 11.70 PLN/km.",
      autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
      fixedPriceHint: "Wenn Sie einen Festpreis vorschlagen möchten, klicken Sie hier und füllen das Feld aus.",
      pricePlaceholder: "Ihr Angebot in PLN eingeben (z. B. 150)",
      priceHelp: "Schlagen Sie Ihren Preis vor. Wir prüfen und antworten innerhalb von 5-10 Minuten.",
      fixedRouteChecking: "Wir prüfen, ob diese Strecke einen Festpreis hat...",
      fixedRouteTitle: "Festpreis verfügbar",
      fixedRouteBody: (route, price) => `${route} - Festpreis ${price} PLN.`,
      fixedRouteCta: "Festpreis buchen",
      fixedRouteHint: "Für die schnellste Bestätigung den Festpreis buchen.",
      fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
      fixedRouteAllDay: "All-day rate applies",
      fixedRouteDay: "Tagtarif gilt",
      fixedRouteNight: "Nachttarif gilt",
      fixedRouteLocked: "Diese Strecke hat einen Festpreis. Bitte über das Festpreis-Formular buchen.",
      fixedRouteComputed: (price) => `Festpreis berechnet: ${price} PLN`,
      fixedRouteFooter: (price) => `Transfer buchen - ${price} PLN`,
      longRouteTitle: "Long route estimate",
      longRouteDistance: (distance) => `Distance: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
      longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
      longRouteNote: "You can still enter your own price below.",
      date: "Datum",
      pickupTime: "Abholzeit",
      signServiceTitle: "Abholung am Flughafen",
      signServiceSign: "Abholung mit Namensschild",
      signServiceFee: "+20 PLN zum Endpreis",
      signServiceSelf: "Fahrer selbst auf dem Parkplatz finden",
      signServiceSelfNote: "Der Fahrer kontaktiert dich per WhatsApp oder telefonisch und ihr trefft euch.",
      signText: "Text für Namensschild",
      signPlaceholder: "Text für das Abholschild",
      signHelp: "Der Fahrer wartet mit einem Schild, bis Sie die Ankunftshalle verlassen.",
      signPreview: "Schildvorschau:",
      signEmpty: "Ihr Name erscheint hier",
      flightNumber: "Flugnummer",
      flightPlaceholder: "z. B. LO123",
      passengers: "Anzahl der Passagiere",
      passengersOptions: ["1 Person", "2 Personen", "3 Personen", "4 Personen", "5+ Personen"],
      largeLuggage: "Großes Gepäck",
      luggageNo: "Nein",
      luggageYes: "Ja",
      contactTitle: "Kontaktdaten",
      fullName: "Vollständiger Name",
      namePlaceholder: "Ihr Name",
      phoneNumber: "Telefonnummer",
      email: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.com",
      emailHelp: "Sie erhalten innerhalb von 5-10 Minuten eine Antwort",
      notesTitle: "Zusätzliche Hinweise (optional)",
      notesPlaceholder: "Besondere Wünsche oder zusätzliche Informationen...",
      notesHelp: "Z. B. Kindersitz erforderlich, Wartezeit, besondere Anweisungen",
      submitting: "Wird gesendet...",
      formIncomplete: "Formular ausfüllen, um fortzufahren",
      missingFields: (fields) => `Bitte ausfüllen: ${fields}.`,
      submit: "Angebotsanfrage senden"
    },
    manageOrder: {
      errors: {
        load: "Bestellung konnte nicht geladen werden.",
        loadNetwork: "Netzwerkfehler beim Laden der Bestellung.",
        save: "Änderungen konnten nicht gespeichert werden.",
        saveNetwork: "Netzwerkfehler beim Speichern der Änderungen.",
        cancel: "Bestellung konnte nicht storniert werden.",
        cancelNetwork: "Netzwerkfehler beim Stornieren der Bestellung.",
        copySuccess: "In die Zwischenablage kopiert",
        copyFail: "Kopieren in die Zwischenablage fehlgeschlagen",
        emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse ein."
      },
      loading: "Ihre Bestellung wird geladen...",
      accessTitle: "Buchung aufrufen",
      accessBody: "Geben Sie die E-Mail-Adresse ein, die Sie bei der Buchung verwendet haben.",
      accessPlaceholder: "sie@example.com",
      accessAction: "Weiter",
      accessChecking: "Prüfen...",
      cancelledTitle: "Bestellung storniert",
      cancelledBody: "Ihre Bestellung wurde storniert. Wenn dies ein Fehler war, erstellen Sie bitte eine neue Buchung.",
      manageTitle: "Transfer verwalten",
      copyAction: "Kopieren",
      orderLabel: "Bestellung #",
      orderIdLabel: "Bestell-ID",
      detailsUpdatedTitle: "Details aktualisiert",
      detailsUpdatedBody: (date, time) => `Danke! Ihre Details wurden aktualisiert. Ihr Transfer bleibt für ${date} um ${time} bestätigt. Wir sehen uns dann.`,
      updateSubmittedTitle: "Aktualisierung gesendet",
      updateSubmittedBody: "Ihre Aktualisierungsanfrage wurde gesendet. Wir prüfen sie und melden uns.",
      awaiting: "Warten auf Bestätigung...",
      transferRoute: "Transferstrecke",
      priceLabel: "Preis:",
      pricePending: "Preis wird individuell bestätigt",
      taximeterTitle: "Price calculated by taximeter",
      taximeterRates: "View taximeter rates",
      tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
      statusConfirmed: "Bestätigt",
      statusCompleted: "Abgeschlossen",
      statusFailed: "Nicht abgeschlossen",
      statusRejected: "Abgelehnt",
      statusPriceProposed: "Preis vorgeschlagen",
      statusPending: "Ausstehend",
      bookingDetails: "Buchungsdetails",
      editDetails: "Details bearbeiten",
      updateRequested: "Aktualisierung angeforderter Felder",
      confirmedEditNote: "Das Bearbeiten einer bestätigten Bestellung sendet sie zur erneuten Bestätigung.",
      updateFieldsNote: "Bitte aktualisieren Sie die markierten Felder und speichern Sie Ihre Änderungen.",
      confirmedNote: "Diese Bestellung wurde bestätigt.",
      completedNote: "Diese Bestellung wurde als abgeschlossen markiert.",
      failedNote: "Diese Bestellung wurde als nicht abgeschlossen markiert.",
      priceProposedNote: "Ein neuer Preis wurde vorgeschlagen. Bitte prüfen Sie Ihre E-Mail, um ihn anzunehmen oder abzulehnen.",
      rejectedNote: "Diese Bestellung wurde abgelehnt. Bearbeitung ist deaktiviert, aber Sie können die Buchung stornieren.",
      rejectionReasonLabel: "Grund:",
      date: "Datum",
      pickupTime: "Abholzeit",
      signServiceTitle: "Airport arrival pickup",
      signServiceSign: "Meet with a name sign",
      signServiceFee: "+20 PLN added to final price",
      signServiceSelf: "Find the driver myself at the parking",
      signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
      signText: "Text für Namensschild",
      flightNumber: "Flugnummer",
      pickupAddress: "Abholadresse",
      passengers: "Anzahl der Passagiere",
      passengersBus: ["5 Personen", "6 Personen", "7 Personen", "8 Personen"],
      passengersStandard: ["1 Person", "2 Personen", "3 Personen", "4 Personen"],
      largeLuggage: "Großes Gepäck",
      luggageNo: "Nein",
      luggageYes: "Ja",
      contactTitle: "Kontaktdaten",
      fullName: "Vollständiger Name",
      phoneNumber: "Telefonnummer",
      email: "E-Mail-Adresse",
      notesTitle: "Zusätzliche Hinweise (optional)",
      saveChanges: "Änderungen speichern",
      cancelEdit: "Abbrechen",
      editBooking: "Buchung bearbeiten",
      cancelBooking: "Buchung stornieren",
      changesNotice: "Änderungen werden per E-Mail bestätigt. Für dringende Änderungen kontaktieren Sie uns unter booking@taxiairportgdansk.com",
      updateRequestNote: "Ihre Buchung wurde aktualisiert. Bitte prüfen und bestätigen Sie die Änderungen.",
      rejectNote: "Diese Buchung wurde abgelehnt. Kontaktieren Sie den Support bei Fragen.",
      cancelPromptTitle: "Buchung stornieren?",
      cancelPromptBody: "Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.",
      confirmCancel: "Ja, stornieren",
      keepBooking: "Buchung behalten",
      copyOrderLabel: "Bestellung #",
      copyOrderIdLabel: "Bestell-ID"
    },
    adminOrders: {
      title: "Admin-Bestellungen",
      subtitle: "Alle aktuellen Bestellungen und Status.",
      loading: "Bestellungen werden geladen...",
      missingToken: "Admin-Token fehlt.",
      errorLoad: "Bestellungen konnten nicht geladen werden.",
      filters: {
        all: "All",
        active: "In progress",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      statuses: {
        pending: "Pending",
        confirmed: "Confirmed",
        price_proposed: "Price proposed",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      columns: {
        order: "Bestellung",
        pickup: "Abholung",
        customer: "Kunde",
        price: "Preis",
        status: "Status",
        open: "Öffnen"
      },
      empty: "Keine Bestellungen gefunden.",
      pendingPrice: (price) => `Ausstehend: ${price} PLN`,
      view: "Ansehen"
    },
    adminOrder: {
      title: "Admin-Bestellungsdetails",
      subtitle: "Verwalten, bestätigen oder ablehnen Sie diese Bestellung.",
      back: "Zurück zu allen Bestellungen",
      loading: "Bestellung wird geladen...",
      missingToken: "Admin-Token fehlt.",
      errorLoad: "Bestellung konnte nicht geladen werden.",
      updated: "Bestellung aktualisiert.",
      updateError: "Bestellung konnte nicht aktualisiert werden.",
      statusUpdated: "Bestellstatus aktualisiert.",
      updateRequestSent: "Aktualisierungsanfrage an den Kunden gesendet.",
      updateRequestError: "Aktualisierungsanfrage konnte nicht gesendet werden.",
      updateRequestSelect: "Wählen Sie mindestens ein Feld zur Aktualisierung aus.",
      orderLabel: "Bestellung",
      idLabel: "ID",
      customerLabel: "Kunde",
      pickupLabel: "Abholung",
      priceLabel: "Preis",
      pendingPrice: (price) => `Ausstehend: ${price} PLN`,
      additionalInfo: "Zusätzliche Informationen",
      passengers: "Passagiere:",
      largeLuggage: "Großes Gepäck:",
      pickupType: "Abholart:",
      signService: "Abholservice:",
      signServiceSign: "Abholung mit Namensschild",
      signServiceSelf: "Fahrer selbst finden",
      signFee: "Aufpreis für Schild:",
      flightNumber: "Flugnummer:",
      signText: "Text für Namensschild:",
      route: "Route:",
      notes: "Notizen:",
      adminActions: "Admin-Aktionen",
      confirmOrder: "Bestellung bestätigen",
      rejectOrder: "Bestellung ablehnen",
      proposePrice: "Neuen Preis vorschlagen (PLN)",
      sendPrice: "Preisvorschlag senden",
      rejectionReason: "Ablehnungsgrund (optional)",
      requestUpdate: "Kunden-Update anfordern",
      requestUpdateBody: "Wählen Sie die Felder, die der Kunde aktualisieren soll. Er erhält eine E-Mail mit einem Link zur Bearbeitung.",
      fieldPhone: "Telefonnummer",
      fieldEmail: "E-Mail-Adresse",
      fieldFlight: "Flugnummer",
      requestUpdateAction: "Update anfordern",
      cancelConfirmedTitle: "Confirmed order cancellation",
      cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
      cancelConfirmedAction: "Cancel confirmed order",
      cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
      cancelConfirmedSuccess: "Order cancelled.",
      deleteRejectedTitle: "Delete rejected order",
      deleteRejectedBody: "Remove this rejected order permanently.",
      deleteRejectedAction: "Delete rejected order",
      deleteRejectedConfirm: "Delete this rejected order permanently?",
      deleteRejectedSuccess: "Order deleted.",
      completionTitle: "Status der Durchführung",
      markCompleted: "Als abgeschlossen markieren",
      markCompletedConfirm: "Mark this order as completed?",
      markFailed: "Als nicht abgeschlossen markieren",
      markFailedConfirm: "Mark this order as not completed?"
    },
    pages: {
      gdanskTaxi: {
        title: "Gdańsk Flughafen Taxi",
        description: "Buchen Sie ein schnelles, zuverlässiges Flughafentaxi vom Flughafen Gdańsk. Festpreise in beide Richtungen, professionelle Fahrer und schnelle Bestätigung.",
        route: "Flughafen Gdańsk",
        examples: ["Altstadt Gdańsk", "Gdańsk Oliwa", "Gdańsk Hauptbahnhof", "Brzeźno Strand"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Transfer vom Flughafen Gdańsk nach Sopot",
        description: "Privater Transfer zwischen dem Flughafen Gdańsk und Sopot mit Festpreisen in beide Richtungen und Flugverfolgung.",
        route: "Flughafen Gdańsk ↔ Sopot",
        examples: ["Sopot Pier", "Sopot Zentrum", "Hotels in Sopot", "Bahnhof Sopot"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Transfer vom Flughafen Gdańsk nach Gdynia",
        description: "Komfortabler Transfer zwischen dem Flughafen Gdańsk und Gdynia mit Festpreisen in beide Richtungen.",
        route: "Flughafen Gdańsk ↔ Gdynia",
        examples: ["Gdynia Zentrum", "Hafen Gdynia", "Hotels in Gdynia", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  },
  fi: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Tarkista hinta ja varaa TAKSI",
      orderNow: "Varaa nyt",
      close: "Sulje",
      noPrepayment: "Ei ennakkomaksua",
      backToHome: "← Takaisin etusivulle",
      notFoundTitle: "Sivua ei löytynyt",
      notFoundBody: "Etsimäsi sivu ei ole olemassa tai se on siirretty.",
      notFoundCta: "Siirry etusivulle",
      notFoundSupport: "Jos tämä on virhe, ota yhteyttä:",
      notFoundRequested: "Pyydetty URL-osoite",
      notFoundPopular: "Suositut sivut",
      actualBadge: "VOIMASSA",
      priceFrom: "alkaen",
      perNight: "yöllä",
      perDay: "keskustaan (päivä)",
      whatsappMessage: "Hei Taxi Airport Gdańsk, haluan varata kuljetuksen."
    },
    navbar: {
      home: "Etusivu",
      fleet: "Kalustomme",
      airportTaxi: "Gdańskin lentokenttätaksi",
      airportSopot: "Lentokenttä ↔ Sopot",
      airportGdynia: "Lentokenttä ↔ Gdynia",
      prices: "Hinnat",
      orderNow: "VARAA NYT",
      language: "Kieli"
    },
    hero: {
      promo: {
        dayPrice: "VAIN 100 PLN",
        dayLabel: "keskustaan (päivä)",
        nightPrice: "120 PLN",
        nightLabel: "yöllä"
      },
      logoAlt: "Taxi Airport Gdańsk - Lentokenttäkuljetus & limusiinipalvelu",
      orderViaEmail: "Tilaa sähköpostilla",
      headline: "Gdańsk lentokenttä taksi – kuljetukset Gdańskiin, Sopotiin ja Gdyniaan",
      subheadline: "Gdansk airport taxi, kiinteät hinnat, 24/7 palvelu ja nopea vahvistus.",
      whyChoose: "Miksi valita Taxi Airport Gdańsk",
      benefits: "Edut",
      benefitsList: {
        flightTrackingTitle: "Lentojen seuranta",
        flightTrackingBody: "Seuraamme saapumisia ja säädämme noutoajan automaattisesti.",
        meetGreetTitle: "Meet & greet",
        meetGreetBody: "Ammattikuljettajat, selkeä viestintä ja apu matkatavaroiden kanssa.",
        fastConfirmationTitle: "Nopea vahvistus",
        fastConfirmationBody: "Useimmat varaukset vahvistetaan 5–10 minuutissa.",
        flexiblePaymentsTitle: "Joustavat maksut",
        flexiblePaymentsBody: "Kortti, Apple Pay, Google Pay, Revolut tai käteinen.",
        freePrebookingTitle: "Maksuton ennakkovaraus",
        freePrebookingBody: "Peruuta milloin tahansa maksutta. Täysin automatisoitu.",
        fixedPriceTitle: "Kiinteän hinnan takuu",
        fixedPriceBody: "Kiinteä hinta molempiin suuntiin. Varaushinta on lopullinen.",
        localExpertiseTitle: "Paikallinen osaaminen",
        localExpertiseBody: "Kokeneet Tri-City-kuljettajat ja nopeat reitit.",
        assistanceTitle: "24/7 tuki",
        assistanceBody: "Saatavilla ennen matkaa, sen aikana ja sen jälkeen."
      },
      fleetTitle: "Kalustomme",
      fleetLabel: "Ajoneuvot",
      standardCarsTitle: "Perusautot",
      standardCarsBody: "1-4 matkustajaa | Mukavat sedanit ja SUV:t",
      busTitle: "Ja lisää busseja",
      busBody: "5-8 matkustajaa | Täydellinen suuremmille ryhmille"
    },
    vehicle: {
      title: "Valitse ajoneuvo",
      subtitle: "Valitse ryhmällesi sopivin ajoneuvo",
      standardTitle: "Perusauto",
      standardPassengers: "1-4 matkustajaa",
      standardDescription: "Sopii yksin matkustaville, pariskunnille ja pienille perheille",
      busTitle: "BUS-palvelu",
      busPassengers: "5-8 matkustajaa",
      busDescription: "Ihanteellinen suuremmille ryhmille ja perheille, joilla on paljon matkatavaroita",
      examplePrices: "Esimerkkihinnat:",
      airportGdansk: "Lentokenttä ↔ Gdańsk",
      airportSopot: "Lentokenttä ↔ Sopot",
      airportGdynia: "Lentokenttä ↔ Gdynia",
      selectStandard: "Valitse perusauto",
      selectBus: "Valitse BUS-palvelu"
    },
    pricing: {
      back: "Takaisin ajoneuvovalintaan",
      titleStandard: "Perusauto (1-4 matkustajaa)",
      titleBus: "BUS-palvelu (5-8 matkustajaa)",
      description: "Kiinteät hinnat molempiin suuntiin (kentälle ja kentältä). Ei piilokuluja. Yötaksa klo 22–6 sekä sunnuntaisin ja pyhäpäivinä.",
      dayRate: "Päivätaksa",
      nightRate: "Yötaksa",
      sundayNote: "(Sunnuntai & pyhäpäivät)",
      customRouteTitle: "Mukautettu reitti",
      customRouteBody: "Tarvitsetko toisen kohteen?",
      customRoutePrice: "Kiinteat hinnat",
      customRoutePriceBody: "Joustava hinnoittelu reitin mukaan",
      customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
      requestQuote: "Varaa nyt",
      pricesNote: "Hinnat sisältävät ALV:n. Lisäkohteet pyynnöstä.",
      tableTitle: "Hintataulukko",
      tableRoute: "Reitti",
      tableStandardDay: "Standardi päivä",
      tableStandardNight: "Standardi yö",
      tableBusDay: "Bussi päivä",
      tableBusNight: "Bussi yö",
      tariffsTitle: "Taksamittaritariffit (mukautetut reitit)",
      tariffsName: "Tariffi",
      tariffsRate: "Hinta",
      bookingTitle: "Varaa kyyti",
      bookingSubtitle: "Valitse ajoneuvotyyppi ja varaa kyyti heti.",
      routes: {
        airport: "Lentokenttä",
        gdansk: "Gdańskin keskusta",
        gdynia: "Gdynian keskusta"
      }
    },
    pricingLanding: {
      title: "Gdańsk-lentokenttätaksin hinnat",
      subtitle: "Kiinteät hinnat lentokenttäkuljetuksille ja selkeä hinnoittelu mukautetuille reiteille.",
      description: "Vertaile perus- ja bussihintoja, varaa heti tai pyydä tarjous.",
      cta: "Varaa kyyti",
      calculatorCta: "Laskuri",
      highlights: [
        {
          title: "Kiinteät hinnat molempiin suuntiin",
          body: "Listatut kenttäreitit ovat kiinteähintaisia ilman piilokuluja."
        },
        {
          title: "24/7 saatavilla",
          body: "Palvelemme joka päivä, nopea vahvistus ja tuki."
        },
        {
          title: "Bussipalvelu ryhmille",
          body: "Tilavat 5–8 paikan ajoneuvot perheille ja ryhmille."
        }
      ],
      faqTitle: "Hinnoittelun FAQ",
      faq: [
        {
          question: "Ovatko hinnat kiinteät?",
          answer: "Kyllä. Lentokenttäreiteillä on kiinteät hinnat molempiin suuntiin. Mukautetut reitit hinnoitellaan yksilöllisesti."
        },
        {
          question: "Milloin yötaksa on voimassa?",
          answer: "22:00–6:00 sekä sunnuntaisin ja pyhäpäivinä."
        },
        {
          question: "Seuraatteko lennon viivästyksiä?",
          answer: "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
        },
        {
          question: "Voinko maksaa kortilla?",
          answer: "Korttimaksu pyynnöstä. Laskut yritysasiakkaille."
        }
      ]
    },
    pricingCalculator: {
      title: "Hintalaskuri",
      subtitle: "Syötä nouto ja määränpää saadaksesi hinta-arvion.",
      airportLabel: "Gdańsk-lentoasema",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Nouto osoitteesta",
      destinationCustomLabel: "Määränpää osoite",
      pickupLabel: "Noutopaikka",
      pickupPlaceholder: "esim. Gdańsk Airport, Słowackiego 200",
      destinationLabel: "Määränpää",
      destinationPlaceholder: "esim. Sopot, Monte Cassino 1",
      distanceLabel: "Etäisyys",
      resultsTitle: "Arvioitu hinta",
      fixedAllDay: "Koko päivän hinta",
      dayRate: "Päivähinta",
      nightRate: "Yöhinta",
      dayRateLabel: "Päivähinta",
      allDayRateLabel: "Vuorokausihinta",
      guaranteedPriceLabel: "Taattu hinta",
      standard: "Standard",
      bus: "Bussi",
      loading: "Lasketaan reittiä...",
      noResult: "Reittiä ei voitu laskea. Kokeile tarkempaa osoitetta.",
      longRouteTitle: "Pitkän reitin arvio",
      taximeterLabel: "Taksamittari",
      proposedLabel: "Ehdotettu hinta",
      savingsLabel: "Säästö",
      orderNow: "Varaa nyt",
      note: "Hinnat ovat kiinteät. Voit ehdottaa toista hintaa toisen reitin tilauslomakkeessa."
    },
    trust: {
      companyTitle: "Yritystiedot",
      paymentTitle: "Maksu & laskut",
      comfortTitle: "Mukavuus & turvallisuus",
      paymentBody: "Käteinen tai kortti pyynnöstä. Laskut yritysasiakkaille.",
      comfortBody: "Lastenistuimet pyynnöstä. Ammattitaitoiset, lisensoidut kuljettajat ja ovelta ovelle -palvelu."
    },
    footer: {
      description: "Ammattimainen lentokenttäkuljetus Tri-City-alueella. Saatavilla 24/7.",
      contactTitle: "Yhteys",
      location: "Gdańsk, Puola",
      bookingNote: "Varaa verkossa, WhatsAppissa tai sähköpostilla",
      hoursTitle: "Palveluajat",
      hoursBody: "24/7 - saatavilla joka päivä",
      hoursSub: "Kenttäkuljetukset, kaupunkikuljetukset ja räätälöidyt reitit",
      routesTitle: "Suositut reitit",
      rights: "Kaikki oikeudet pidätetään.",
      cookiePolicy: "Evästekäytäntö",
      privacyPolicy: "Tietosuojakäytäntö"
    },
    cookieBanner: {
      title: "Evästeasetukset",
      body: "Käytämme välttämättömiä evästeitä pitääksemme varausprosessin turvallisena ja luotettavana. Suostumuksellasi käytämme myös markkinointievästeitä mainoskonversioiden mittaamiseen. Voit muuttaa valintaa tyhjentämällä selaimen tallennustilan.",
      readPolicy: "Lue käytäntö",
      decline: "Hylkää",
      accept: "Hyväksy evästeet"
    },
    cookiePolicy: {
      title: "Evästekäytäntö",
      updated: "Päivitetty: 2. tammikuuta 2026",
      intro: "Tämä sivusto käyttää evästeitä, jotta se toimii luotettavasti ja varauksesi pysyy turvallisena. Suostumuksellasi käytämme myös markkinointievästeitä konversioiden mittaamiseen.",
      sectionCookies: "Mitä evästeitä käytämme",
      cookiesList: [
        "Välttämättömät evästeet turvallisuuteen ja väärinkäytösten ehkäisyyn.",
        "Asetusevästeet perusvalintojen muistamiseen istunnon aikana.",
        "Markkinointievästeet mainoskonversioiden mittaamiseen (Google Ads)."
      ],
      sectionManage: "Evästeiden hallinta",
      manageBody1: "Voit poistaa evästeet milloin tahansa selaimen asetuksista. Välttämättömien evästeiden esto voi estää varauslomakkeen ja hallinnan toiminnan.",
      manageBody2: "Voit myös muuttaa markkinointievästeiden valintaa tyhjentämällä selaimen tallennustilan ja palaamalla sivustolle.",
      contact: "Yhteys",
      contactBody: "Jos sinulla on kysyttävää tästä käytännöstä, ota yhteyttä"
    },
    privacyPolicy: {
      title: "Tietosuojakäytäntö",
      updated: "Päivitetty: 2. tammikuuta 2026",
      intro: "Tämä tietosuojakäytäntö selittää, miten Taxi Airport Gdańsk kerää ja käsittelee henkilötietoja varauspalveluiden ja sivuston käytön yhteydessä.",
      controllerTitle: "Rekisterinpitäjä",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Puola\nSähköposti:",
      dataTitle: "Mitä tietoja keräämme",
      dataList: [
        "Yhteystiedot kuten nimi, sähköpostiosoite ja puhelinnumero.",
        "Varaustiedot kuten noutopaikka, päivämäärä, aika, lennon numero ja muistiinpanot.",
        "Tekniset tiedot kuten IP-osoite ja selaimen perustiedot turvallisuutta varten."
      ],
      whyTitle: "Miksi käsittelemme tietojasi",
      whyList: [
        "Vastataksemme varaustoiveeseesi ja toimittaaksemme palvelun.",
        "Kommunikoidaksemme varauksesta, muutoksista tai peruutuksista.",
        "Noudattaaksemme lakisääteisiä velvoitteita ja ehkäistäksemme väärinkäytöksiä."
      ],
      legalTitle: "Oikeusperuste",
      legalList: [
        "Sopimuksen täyttäminen (GDPR Art. 6(1)(b)).",
        "Lakisääteinen velvoite (GDPR Art. 6(1)(c)).",
        "Oikeutettu etu (GDPR Art. 6(1)(f)), kuten turvallisuus ja petosten ehkäisy."
      ],
      storageTitle: "Kuinka kauan säilytämme tietoja",
      storageBody: "Säilytämme varaustietoja vain niin kauan kuin palvelun tarjoaminen ja lakisääteiset vaatimukset edellyttävät.",
      shareTitle: "Kenelle jaamme tietoja",
      shareBody: "Jaamme tietoja vain palveluntarjoajille, jotka ovat välttämättömiä varauksen toimittamiseen (esim. sähköpostipalvelut). Emme myy henkilötietoja.",
      rightsTitle: "Oikeutesi",
      rightsList: [
        "Oikeus saada pääsy tietoihin, oikaista tai poistaa ne.",
        "Oikeus rajoittaa tai vastustaa käsittelyä.",
        "Oikeus siirtää tiedot, soveltuvin osin.",
        "Oikeus tehdä valitus valvontaviranomaiselle."
      ],
      contactTitle: "Yhteys",
      contactBody: "Tietosuojaan liittyvissä pyynnöissä ota yhteyttä"
    },
    routeLanding: {
      orderNow: "Varaa verkossa nyt",
      quickLinks: "Quick links",
      pricingLink: "Katso hinnat",
      orderLinks: {
        airportGdansk: "Book airport → Gdańsk",
        airportSopot: "Book airport → Sopot",
        airportGdynia: "Book airport → Gdynia",
        custom: "Custom route"
      },
      seoParagraph: (route) => `Gdansk airport taxi reitille ${route}. Kiinteät hinnat, 24/7 palvelu, meet & greet ja nopea vahvistus.`,
      pricingTitle: "Esimerkkihinnat",
      pricingSubtitle: (route) => `Perusauto reitille ${route}`,
      vehicleLabel: "Perusauto",
      dayLabel: "Päivätaksa",
      nightLabel: "Yötaksa",
      currency: "PLN",
      pricingNote: "Hinnat sisältävät ALV:n. Yötaksa on voimassa klo 22–6 sekä sunnuntaisin ja pyhäpäivinä.",
      includedTitle: "Mitä sisältyy",
      includedList: [
        "Meet & greet lentokentällä selkeillä nouto-ohjeilla.",
        "Lentojen seuranta ja joustava noutoaika.",
        "Kiinteä hinnoittelu molempiin suuntiin ilman piilokuluja.",
        "Ammattikuljettajat, englanninkielinen palvelu."
      ],
      destinationsTitle: "Suositut kohteet",
      faqTitle: "UKK",
      faq: [
        {
          question: "Kuinka nopeasti vahvistus tulee?",
          answer: "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
        },
        {
          question: "Seuraatteko lentoja?",
          answer: "Kyllä, seuraamme saapumisia ja säädämme noutoaikaa."
        },
        {
          question: "Voinko peruuttaa?",
          answer: "Voit peruuttaa vahvistusviestin linkistä."
        },
        {
          question: "Tarjoatteko lastenistuimia?",
          answer: "Kyllä, lastenistuimet ovat saatavilla pyynnöstä varauksen yhteydessä."
        },
        {
          question: "Miten voin maksaa?",
          answer: "Voit maksaa kortilla, Apple Paylla, Google Paylla, Revolutilla tai käteisellä pyynnöstä."
        },
        {
          question: "Missä tapaan kuljettajan?",
          answer: "Saat selkeät nouto-ohjeet ja yhteystiedot vahvistusviestissä."
        }
      ]
    },
    countryLanding: {
      title: "Gdańskin lentokenttäkuljetus Suomesta",
      description: "Yksityinen lentokenttäkuljetus Gdańskissa kiinteillä hinnoilla, 24/7 nouto ja nopea vahvistus.",
      intro: "Sopii lennoille Suomesta Gdańskin lentoasemalle (GDN). Varaa verkossa ja saat vahvistuksen nopeasti.",
      ctaPrimary: "Varaa kuljetus",
      ctaSecondary: "Katso hinnat",
      highlightsTitle: "Miksi varata etukäteen",
      highlights: [
        "Meet & greet ja selkeät nouto-ohjeet.",
        "Lentojen seuranta ja joustava noutoaika.",
        "Kiinteät hinnat ilman piilokuluja.",
        "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
      ],
      airportsTitle: "Lähtölentoasemia (Suomi)",
      airports: [
        "Helsinki (HEL)",
        "Turku (TKU)"
      ],
      faqTitle: "FAQ suomalaisille",
      faq: [
        {
          question: "Voinko maksaa euroilla?",
          answer: "Hinnat ovat PLN-valuutassa. Korttimaksu muunnetaan automaattisesti pankkisi toimesta."
        },
        {
          question: "Saisinko kuitin tai laskun?",
          answer: "Kyllä, kerro tästä varauksen yhteydessä ja lähetämme kuitin sähköpostilla."
        },
        {
          question: "Seuraatteko lentoja?",
          answer: "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
        },
        {
          question: "Kuinka nopeasti saan vahvistuksen?",
          answer: "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Gdańskin lentokenttäkuljetus (${airport})`,
      description: (city, airport) => `Yksityinen kuljetus ${airport}-lentoasemalta Gdańskiin, Sopotiin ja Gdyniaan. Kiinteät hinnat ja 24/7 nouto.`,
      intro: (city, airport) => `Suorat lennot ${airport}-lentoasemalta Gdańskiin ovat kausiluonteisia. Varaa kuljetus etukäteen.`,
      ctaPrimary: "Varaa kuljetus",
      ctaSecondary: "Katso hinnat",
      highlightsTitle: "Miksi varata etukäteen",
      highlights: [
        "Meet & greet ja selkeät nouto-ohjeet.",
        "Lentojen seuranta ja joustava noutoaika.",
        "Kiinteät hinnat ilman piilokuluja.",
        "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
      ],
      routeTitle: (airport) => `Matka ${airport}-lentoasemalta Gdańskiin`,
      routeBody: (airport) => `Noudamme saapuvia lentoja ${airport}-lentoasemalta ja viemme perille Gdańskiin, Sopotiin ja Gdyniaan.`,
      destinationsTitle: "Suositut kohteet Tri-Cityssä",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Onko suoria lentoja {city}stä Gdańskiin?",
          answer: "Suorat lennot ovat kausiluonteisia. Tarkista ajantasainen aikataulu ennen matkaa."
        },
        {
          question: "Miten tapaan kuljettajan?",
          answer: "Saat nouto-ohjeet ja yhteystiedot vahvistussähköpostissa."
        },
        {
          question: "Seuraatteko lentoja?",
          answer: "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
        },
        {
          question: "Voinko maksaa kortilla?",
          answer: "Kyllä, korttimaksu on mahdollinen. Käteinen pyynnöstä."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Kiinteät hinnat ja 24/7 saatavuus.",
      intro: "Taxi Gdańsk lentokenttäkuljetuksiin ja kaupunkiajoihin. Ammattikuljettajat, nopea vahvistus ja selkeä hinnoittelu.",
      ctaPrimary: "Varaa taxi",
      ctaSecondary: "Katso hinnat",
      highlightsTitle: "Miksi varata meiltä",
      highlights: [
        "Kiinteät hinnat ilman piilokuluja.",
        "Saatavuus 24/7 lentokenttä- ja kaupunkiajoihin.",
        "Lentojen seuranta ja joustava noutoaika.",
        "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
      ],
      serviceAreaTitle: "Palvelualue",
      serviceArea: [
        "Gdańsk vanhakaupunki ja keskusta",
        "Gdańsk Wrzeszcz ja Oliwa",
        "Gdańsk lentokenttä (GDN)",
        "Sopot ja Gdynia"
      ],
      routesTitle: "Suositut taksireitit",
      routes: [
        "Gdańsk lentokenttä → vanhakaupunki",
        "Gdańsk lentokenttä → Sopot",
        "Gdańsk lentokenttä → Gdynia",
        "Vanhakaupunki → Gdańsk lentokenttä"
      ],
      cityRoutesTitle: "Hinnat: Gdańskin lentoasema taksi",
      cityRoutesDescription: "Katso ajantasainen hinta Gdańskin lentoasemalta näihin kohteisiin.",
      cityRoutesItem: (destination) => `Taksihinta Gdańskin lentoasemalta kohteeseen ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Kuinka nopeasti vahvistus tulee?",
          answer: "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
        },
        {
          question: "Onko hinnat kiinteitä?",
          answer: "Kyllä, lentokenttäreiteillä on kiinteät hinnat molempiin suuntiin."
        },
        {
          question: "Voinko maksaa kortilla?",
          answer: "Kyllä, korttimaksu on mahdollinen. Käteinen pyynnöstä."
        },
        {
          question: "Seuraatteko lentoja?",
          answer: "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Syötä kelvollinen puhelinnumero (vain numeroita).",
        phoneLength: "Syötä kelvollinen puhelinnumero (7–15 numeroa, valinnainen +).",
        email: "Syötä kelvollinen sähköpostiosoite.",
        datePast: "Valitse tämän päivän tai tuleva päivämäärä."
      },
      rate: {
        day: "Päivätaksa",
        night: "Yötaksa",
        reasonDay: "vakiopäivätaksa",
        reasonLate: "nouto klo 21:30 jälkeen tai ennen 5:30",
        reasonHoliday: "sunnuntai/pyhäpäivä",
        banner: (label, price, reason) => `Sovelletaan ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Tilauksen lähetys epäonnistui. Yritä uudelleen.",
      submitNetworkError: "Verkkovirhe tilausta lähetettäessä. Yritä uudelleen.",
      submittedTitle: "Tilaus vastaanotettu",
      submittedBody: "Kiitos! Pyyntösi on jonossa. Odota vahvistusta – yleensä 5–10 minuuttia. Saat pian vahvistussähköpostin.",
      awaiting: "Odotetaan vahvistusta...",
      totalPrice: "Kokonaishinta:",
      orderNumber: "Tilaus #:",
      orderId: "Tilaus-ID:",
      manageLink: "Hallitse tai muokkaa tilausta",
      title: "Tilaa kuljetus",
      date: "Päivämäärä",
      pickupTime: "Noutoaika",
      pickupType: "Noutotyyppi",
      pickupTypeHint: "Valitse noutotyyppi jatkaaksesi.",
      airportPickup: "Nouto lentokentältä",
      addressPickup: "Nouto osoitteesta",
      signServiceTitle: "Nouto saapumisalueelta",
      signServiceSign: "Nouto nimikyltillä",
      signServiceFee: "+20 PLN lisätään loppuhintaan",
      signServiceSelf: "Löydän kuljettajan itse pysäköintialueelta",
      signServiceSelfNote: "Kuljettaja ottaa yhteyttä WhatsAppissa tai puhelimitse ja tapaatte.",
      signText: "Nimikyltti",
      signPlaceholder: "Teksti noutokylttiin",
      signHelp: "Kuljettaja odottaa sinua kyltti kädessä, kunnes poistut saapuvien aulasta",
      signPreview: "Kylttiesikatselu:",
      signEmpty: "Nimesi näkyy tässä",
      flightNumber: "Lennon numero",
      flightPlaceholder: "esim. LO123",
      pickupAddress: "Nouto-osoite",
      pickupPlaceholder: "Syötä täydellinen nouto-osoite",
      passengers: "Matkustajien määrä",
      passengerLabel: (count) => `${count} ${count === 1 ? "henkilö" : "henkilöä"}`,
      passengersBus: ["5 henkilöä", "6 henkilöä", "7 henkilöä", "8 henkilöä"],
      passengersStandard: ["1 henkilö", "2 henkilöä", "3 henkilöä", "4 henkilöä"],
      largeLuggage: "Suuret matkatavarat",
      luggageNo: "Ei",
      luggageYes: "Kyllä",
      contactTitle: "Yhteystiedot",
      fullName: "Koko nimi",
      namePlaceholder: "Nimesi",
      phoneNumber: "Puhelinnumero",
      email: "Sähköpostiosoite",
      emailPlaceholder: "sinun@email.com",
      emailHelp: "Saat vahvistusviestin linkillä tilausten muokkaukseen tai peruutukseen",
      notesTitle: "Lisätiedot (valinnainen)",
      notesPlaceholder: "Erityispyynnöt tai lisätiedot...",
      notesHelp: "Esim. lastenistuin, odotusaika, erityisohjeet",
      submitting: "Lähetetään...",
      formIncomplete: "Täytä lomake jatkaaksesi",
      missingFields: (fields) => `Täytä: ${fields}.`,
      reassurance: "Ei ennakkomaksua. Ilmainen peruutus. Vahvistus 5–10 min.",
      confirmOrder: (price) => `Vahvista tilaus - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Syötä kelvollinen puhelinnumero (vain numeroita).",
        phoneLength: "Syötä kelvollinen puhelinnumero (7–15 numeroa, valinnainen +).",
        email: "Syötä kelvollinen sähköpostiosoite.",
        datePast: "Valitse tämän päivän tai tuleva päivämäärä."
      },
      submitError: "Tarjouspyynnön lähetys epäonnistui. Yritä uudelleen.",
      submitNetworkError: "Verkkovirhe tarjouspyyntöä lähetettäessä. Yritä uudelleen.",
      submittedTitle: "Tarjouspyyntö vastaanotettu!",
      submittedBody: "Kiitos! Saat 5-10 minuutin kuluessa sähköpostin, jossa kerrotaan hyväksynnästä tai hylkäyksestä.",
      manageLink: "Hallitse tilausta",
      title: "Pyydä yksilöllinen tarjous",
      subtitle: "Ehdota hintaa ja saat vastauksen 5-10 minuutissa",
      requestButton: "Pyydä tarjous",
      requestAnother: "Pyydä uusi tarjous",
      toggleDescription: "Anna matkan tiedot ja ehdota hintaa. Saat vastauksen 5-10 minuutissa sähköpostilla.",
      pickupType: "Noutotyyppi",
      airportPickup: "Nouto lentokentältä",
      addressPickup: "Nouto osoitteesta",
      lockMessage: "Valitse noutotyyppi avataksesi loput lomakkeesta.",
      pickupAddress: "Nouto-osoite",
      pickupPlaceholder: "Syötä nouto-osoite (esim. Gdańsk Airport, ul. Słowackiego 200)",
      pickupAutoNote: "Lentokentän noutopaikka asetetaan automaattisesti",
      destinationAddress: "Kohdeosoite",
      destinationPlaceholder: "Syötä kohdeosoite (esim. Gdańsk Centrum, ul. Długa 1)",
      price: "Hinta",
      proposedPriceLabel: "Ehdottamasi hinta (PLN)",
      taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
      tariff1: "Tariffi 1 (kaupunki, 6–22): 3.90 PLN/km.",
      tariff2: "Tariffi 2 (kaupunki, 22–6): 5.85 PLN/km.",
      tariff3: "Tariffi 3 (kaupungin ulkopuolella, 6–22): 7.80 PLN/km.",
      tariff4: "Tariffi 4 (kaupungin ulkopuolella, 22–6): 11.70 PLN/km.",
      autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
      fixedPriceHint: "Jos haluat ehdottaa kiinteää hintaa, klikkaa tästä ja täytä kenttä.",
      pricePlaceholder: "Syötä tarjous PLN (esim. 150)",
      priceHelp: "Ehdota hintaa tälle matkalle. Tarkistamme ja vastaamme 5-10 minuutissa.",
      fixedRouteChecking: "Checking if this route qualifies for a fixed price...",
      fixedRouteTitle: "Fixed price available",
      fixedRouteBody: (route, price) => `${route} - fixed price ${price} PLN.`,
      fixedRouteCta: "Book fixed price",
      fixedRouteHint: "Use the fixed-price booking for the fastest confirmation.",
      fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
      fixedRouteAllDay: "All-day rate applies",
      fixedRouteDay: "Day rate applies",
      fixedRouteNight: "Night rate applies",
      fixedRouteLocked: "This route qualifies for a fixed price. Please book via the fixed-price form.",
      fixedRouteComputed: (price) => `Fixed price calculated: ${price} PLN`,
      fixedRouteFooter: (price) => `Book transfer - ${price} PLN`,
      longRouteTitle: "Long route estimate",
      longRouteDistance: (distance) => `Distance: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
      longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
      longRouteNote: "You can still enter your own price below.",
      date: "Päivämäärä",
      pickupTime: "Noutoaika",
      signServiceTitle: "Nouto saapumisalueelta",
      signServiceSign: "Nouto nimikyltillä",
      signServiceFee: "+20 PLN lisätään loppuhintaan",
      signServiceSelf: "Löydän kuljettajan itse pysäköintialueelta",
      signServiceSelfNote: "Kuljettaja ottaa yhteyttä WhatsAppissa tai puhelimitse ja tapaatte.",
      signText: "Nimikyltti",
      signPlaceholder: "Teksti noutokylttiin",
      signHelp: "Kuljettaja odottaa sinua kyltti kädessä, kunnes poistut saapuvien aulasta",
      signPreview: "Kylttiesikatselu:",
      signEmpty: "Nimesi näkyy tässä",
      flightNumber: "Lennon numero",
      flightPlaceholder: "esim. LO123",
      passengers: "Matkustajien määrä",
      passengersOptions: ["1 henkilö", "2 henkilöä", "3 henkilöä", "4 henkilöä", "5+ henkilöä"],
      largeLuggage: "Suuret matkatavarat",
      luggageNo: "Ei",
      luggageYes: "Kyllä",
      contactTitle: "Yhteystiedot",
      fullName: "Koko nimi",
      namePlaceholder: "Nimesi",
      phoneNumber: "Puhelinnumero",
      email: "Sähköpostiosoite",
      emailPlaceholder: "sinun@email.com",
      emailHelp: "Saat vastauksen 5-10 minuutissa",
      notesTitle: "Lisätiedot (valinnainen)",
      notesPlaceholder: "Erityispyynnöt tai lisätiedot...",
      notesHelp: "Esim. lastenistuin, odotusaika, erityisohjeet",
      submitting: "Lähetetään...",
      formIncomplete: "Täytä lomake jatkaaksesi",
      missingFields: (fields) => `Täytä: ${fields}.`,
      submit: "Lähetä tarjouspyyntö"
    },
    manageOrder: {
      errors: {
        load: "Tilausta ei voitu ladata.",
        loadNetwork: "Verkkovirhe tilausta ladattaessa.",
        save: "Muutoksia ei voitu tallentaa.",
        saveNetwork: "Verkkovirhe muutoksia tallennettaessa.",
        cancel: "Tilausta ei voitu peruuttaa.",
        cancelNetwork: "Verkkovirhe tilausta peruuttaessa.",
        copySuccess: "Kopioitu leikepöydälle",
        copyFail: "Kopiointi epäonnistui",
        emailRequired: "Syötä sähköpostiosoite."
      },
      loading: "Ladataan tilausta...",
      accessTitle: "Pääsy varaukseen",
      accessBody: "Syötä varauksessa käytetty sähköpostiosoite.",
      accessPlaceholder: "sinä@example.com",
      accessAction: "Jatka",
      accessChecking: "Tarkistetaan...",
      cancelledTitle: "Tilaus peruttu",
      cancelledBody: "Tilauksesi on peruttu. Jos tämä oli virhe, tee uusi varaus.",
      manageTitle: "Hallitse kuljetusta",
      copyAction: "Kopioi",
      orderLabel: "Tilaus #",
      orderIdLabel: "Tilaus-ID",
      detailsUpdatedTitle: "Tiedot päivitetty",
      detailsUpdatedBody: (date, time) => `Kiitos! Tietosi on päivitetty. Kuljetus pysyy vahvistettuna ${date} klo ${time}. Nähdään silloin.`,
      updateSubmittedTitle: "Päivityspyyntö lähetetty",
      updateSubmittedBody: "Päivityspyyntö lähetettiin. Tarkistamme sen pian.",
      awaiting: "Odotetaan vahvistusta...",
      transferRoute: "Reitti",
      priceLabel: "Hinta:",
      pricePending: "Hinta vahvistetaan yksilöllisesti",
      taximeterTitle: "Price calculated by taximeter",
      taximeterRates: "View taximeter rates",
      tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
      statusConfirmed: "Vahvistettu",
      statusCompleted: "Valmis",
      statusFailed: "Ei valmis",
      statusRejected: "Hylätty",
      statusPriceProposed: "Hinta ehdotettu",
      statusPending: "Odottaa",
      bookingDetails: "Varauksen tiedot",
      editDetails: "Muokkaa tietoja",
      updateRequested: "Päivitettävät kentät",
      confirmedEditNote: "Vahvistetun tilauksen muokkaus lähettää sen uudelleen hyväksyntään.",
      updateFieldsNote: "Päivitä korostetut kentät ja tallenna muutokset.",
      confirmedNote: "Tämä tilaus on vahvistettu.",
      completedNote: "Tämä tilaus on merkitty valmiiksi.",
      failedNote: "Tämä tilaus on merkitty epäonnistuneeksi.",
      priceProposedNote: "Uusi hinta on ehdotettu. Tarkista sähköpostisi hyväksyäksesi tai hylätäksesi.",
      rejectedNote: "Tämä tilaus on hylätty. Muokkaus on poissa käytöstä, mutta voit peruuttaa varauksen.",
      rejectionReasonLabel: "Syy:",
      date: "Päivämäärä",
      pickupTime: "Noutoaika",
      signServiceTitle: "Airport arrival pickup",
      signServiceSign: "Meet with a name sign",
      signServiceFee: "+20 PLN added to final price",
      signServiceSelf: "Find the driver myself at the parking",
      signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
      signText: "Nimikyltti",
      flightNumber: "Lennon numero",
      pickupAddress: "Nouto-osoite",
      passengers: "Matkustajien määrä",
      passengersBus: ["5 henkilöä", "6 henkilöä", "7 henkilöä", "8 henkilöä"],
      passengersStandard: ["1 henkilö", "2 henkilöä", "3 henkilöä", "4 henkilöä"],
      largeLuggage: "Suuret matkatavarat",
      luggageNo: "Ei",
      luggageYes: "Kyllä",
      contactTitle: "Yhteystiedot",
      fullName: "Koko nimi",
      phoneNumber: "Puhelinnumero",
      email: "Sähköpostiosoite",
      notesTitle: "Lisätiedot (valinnainen)",
      saveChanges: "Tallenna muutokset",
      cancelEdit: "Peruuta",
      editBooking: "Muokkaa varausta",
      cancelBooking: "Peruuta varaus",
      changesNotice: "Muutokset vahvistetaan sähköpostilla. Kiireellisissä tapauksissa ota yhteyttä booking@taxiairportgdansk.com",
      updateRequestNote: "Varaus on päivitetty. Tarkista ja vahvista muutokset.",
      rejectNote: "Tämä varaus on hylätty. Ota yhteyttä tukeen, jos sinulla on kysymyksiä.",
      cancelPromptTitle: "Perutaanko varaus?",
      cancelPromptBody: "Haluatko varmasti peruuttaa varauksen? Tätä ei voi perua.",
      confirmCancel: "Kyllä, peruuta",
      keepBooking: "Pidä varaus",
      copyOrderLabel: "Tilaus #",
      copyOrderIdLabel: "Tilaus-ID"
    },
    adminOrders: {
      title: "Ylläpitäjän tilaukset",
      subtitle: "Kaikki viimeisimmät tilaukset ja tilat.",
      loading: "Ladataan tilauksia...",
      missingToken: "Ylläpitäjän token puuttuu.",
      errorLoad: "Tilauksia ei voitu ladata.",
      filters: {
        all: "All",
        active: "In progress",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      statuses: {
        pending: "Pending",
        confirmed: "Confirmed",
        price_proposed: "Price proposed",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      columns: {
        order: "Tilaus",
        pickup: "Nouto",
        customer: "Asiakas",
        price: "Hinta",
        status: "Tila",
        open: "Avaa"
      },
      empty: "Ei tilauksia.",
      pendingPrice: (price) => `Odottaa: ${price} PLN`,
      view: "Näytä"
    },
    adminOrder: {
      title: "Ylläpitäjän tilauksen tiedot",
      subtitle: "Hallitse, vahvista tai hylkää tilaus.",
      back: "Takaisin tilauksiin",
      loading: "Ladataan tilausta...",
      missingToken: "Ylläpitäjän token puuttuu.",
      errorLoad: "Tilausta ei voitu ladata.",
      updated: "Tilaus päivitetty.",
      updateError: "Tilausta ei voitu päivittää.",
      statusUpdated: "Tilausstatus päivitetty.",
      updateRequestSent: "Päivityspyyntö lähetetty asiakkaalle.",
      updateRequestError: "Päivityspyyntöä ei voitu lähettää.",
      updateRequestSelect: "Valitse vähintään yksi kenttä päivitystä varten.",
      orderLabel: "Tilaus",
      idLabel: "ID",
      customerLabel: "Asiakas",
      pickupLabel: "Nouto",
      priceLabel: "Hinta",
      pendingPrice: (price) => `Odottaa: ${price} PLN`,
      additionalInfo: "Lisätiedot",
      passengers: "Matkustajat:",
      largeLuggage: "Suuret matkatavarat:",
      pickupType: "Noutotyyppi:",
      signService: "Noutotapa:",
      signServiceSign: "Nouto nimikyltillä",
      signServiceSelf: "Kuljettajan etsiminen itse",
      signFee: "Kyltin lisämaksu:",
      flightNumber: "Lennon numero:",
      signText: "Nimikyltti:",
      route: "Reitti:",
      notes: "Muistiinpanot:",
      adminActions: "Ylläpitäjän toiminnot",
      confirmOrder: "Vahvista tilaus",
      rejectOrder: "Hylkää tilaus",
      proposePrice: "Ehdota uutta hintaa (PLN)",
      sendPrice: "Lähetä hintatarjous",
      rejectionReason: "Hylkäyksen syy (valinnainen)",
      requestUpdate: "Pyydä asiakkaan päivitys",
      requestUpdateBody: "Valitse kentät, jotka asiakkaan tulee päivittää. Hän saa sähköpostin muokkauslinkillä.",
      fieldPhone: "Puhelinnumero",
      fieldEmail: "Sähköposti",
      fieldFlight: "Lennon numero",
      requestUpdateAction: "Pyydä päivitys",
      cancelConfirmedTitle: "Confirmed order cancellation",
      cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
      cancelConfirmedAction: "Cancel confirmed order",
      cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
      cancelConfirmedSuccess: "Order cancelled.",
      deleteRejectedTitle: "Delete rejected order",
      deleteRejectedBody: "Remove this rejected order permanently.",
      deleteRejectedAction: "Delete rejected order",
      deleteRejectedConfirm: "Delete this rejected order permanently?",
      deleteRejectedSuccess: "Order deleted.",
      completionTitle: "Valmiustila",
      markCompleted: "Merkitse valmiiksi",
      markCompletedConfirm: "Mark this order as completed?",
      markFailed: "Merkitse epäonnistuneeksi",
      markFailedConfirm: "Mark this order as not completed?"
    },
    pages: {
      gdanskTaxi: {
        title: "Gdańskin lentokenttätaksi",
        description: "Varaa nopea ja luotettava lentokenttätaksi Gdańskin lentokentältä. Kiinteä hinta molempiin suuntiin, ammattikuljettajat ja nopea vahvistus.",
        route: "Gdańskin lentokenttä",
        examples: ["Gdańskin vanhakaupunki", "Gdańsk Oliwa", "Gdańskin päärautatieasema", "Brzeźno Beach"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Kuljetus Gdańskin lentokentältä Sopotiin",
        description: "Yksityinen kuljetus Gdańskin lentokentän ja Sopotin välillä, kiinteä hinta molempiin suuntiin ja lentoseuranta.",
        route: "Gdańskin lentokenttä ↔ Sopot",
        examples: ["Sopot Pier", "Sopotin keskusta", "Sopotin hotellit", "Sopotin rautatieasema"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Kuljetus Gdańskin lentokentältä Gdyniaan",
        description: "Mukava kuljetus Gdańskin lentokentän ja Gdynian välillä kiinteällä hinnalla.",
        route: "Gdańskin lentokenttä ↔ Gdynia",
        examples: ["Gdynian keskusta", "Gdynian satama", "Gdynian hotellit", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  },
  no: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Sjekk pris og bestill TAXI",
      orderNow: "Reserver nå",
      close: "Lukk",
      noPrepayment: "Ingen forhåndsbetaling",
      backToHome: "← Tilbake til forsiden",
      notFoundTitle: "Siden ble ikke funnet",
      notFoundBody: "Siden du leter etter finnes ikke eller er flyttet.",
      notFoundCta: "Gå til forsiden",
      notFoundSupport: "Hvis dette er en feil, kontakt oss:",
      notFoundRequested: "Forespurt URL",
      notFoundPopular: "Populære sider",
      actualBadge: "AKTUELL",
      priceFrom: "fra",
      perNight: "om natten",
      perDay: "til sentrum (dag)",
      whatsappMessage: "Hei Taxi Airport Gdańsk, jeg ønsker å bestille en transfer."
    },
    navbar: {
      home: "Hjem",
      fleet: "Vår flåte",
      airportTaxi: "Gdańsk flyplass taxi",
      airportSopot: "Flyplass ↔ Sopot",
      airportGdynia: "Flyplass ↔ Gdynia",
      prices: "Priser",
      orderNow: "RESERVER NÅ",
      language: "Språk"
    },
    hero: {
      promo: {
        dayPrice: "KUN 100 PLN",
        dayLabel: "til sentrum (dag)",
        nightPrice: "120 PLN",
        nightLabel: "om natten"
      },
      logoAlt: "Taxi Airport Gdańsk - Flyplasstransport & limousineservice",
      orderViaEmail: "Bestill via e-post",
      headline: "Gdańsk flyplass taxi – transport til Gdańsk, Sopot og Gdynia",
      subheadline: "Gdansk airport taxi med faste priser, 24/7 og rask bekreftelse.",
      whyChoose: "Hvorfor velge Taxi Airport Gdańsk",
      benefits: "Fordeler",
      benefitsList: {
        flightTrackingTitle: "Flysporing",
        flightTrackingBody: "Vi følger ankomster og justerer hentetid automatisk.",
        meetGreetTitle: "Meet & greet",
        meetGreetBody: "Profesjonelle sjåfører, tydelig kommunikasjon og hjelp med bagasje.",
        fastConfirmationTitle: "Rask bekreftelse",
        fastConfirmationBody: "De fleste bestillinger bekreftes innen 5–10 minutter.",
        flexiblePaymentsTitle: "Fleksible betalinger",
        flexiblePaymentsBody: "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
        freePrebookingTitle: "Gratis forhåndsbestilling",
        freePrebookingBody: "Avbestill når som helst gratis. Fullt automatisert.",
        fixedPriceTitle: "Fastprisgaranti",
        fixedPriceBody: "Fast pris begge veier. Prisen du bestiller er prisen du betaler.",
        localExpertiseTitle: "Lokal ekspertise",
        localExpertiseBody: "Erfarne Tri-City-sjåfører som kjenner de raskeste rutene.",
        assistanceTitle: "24/7 assistanse",
        assistanceBody: "Alltid tilgjengelig før, under og etter turen."
      },
      fleetTitle: "Vår flåte",
      fleetLabel: "Kjøretøy",
      standardCarsTitle: "Standardbiler",
      standardCarsBody: "1-4 passasjerer | Komfortable sedaner og SUV-er",
      busTitle: "Og flere busser",
      busBody: "5-8 passasjerer | Perfekt for større grupper"
    },
    vehicle: {
      title: "Velg kjøretøy",
      subtitle: "Velg kjøretøytypen som passer gruppestørrelsen",
      standardTitle: "Standardbil",
      standardPassengers: "1-4 passasjerer",
      standardDescription: "Perfekt for enkeltpersoner, par og små familier",
      busTitle: "BUS Service",
      busPassengers: "5-8 passasjerer",
      busDescription: "Ideelt for større grupper og familier med ekstra bagasje",
      examplePrices: "Eksempelpriser:",
      airportGdansk: "Flyplass ↔ Gdańsk",
      airportSopot: "Flyplass ↔ Sopot",
      airportGdynia: "Flyplass ↔ Gdynia",
      selectStandard: "Velg standardbil",
      selectBus: "Velg BUS Service"
    },
    pricing: {
      back: "Tilbake til kjøretøyvalg",
      titleStandard: "Standardbil (1-4 passasjerer)",
      titleBus: "BUS Service (5-8 passasjerer)",
      description: "Faste priser begge veier (til og fra flyplassen). Ingen skjulte gebyrer. Nattpris gjelder 22–6 samt søndager og helligdager.",
      dayRate: "Dagpris",
      nightRate: "Nattpris",
      sundayNote: "(Søndager og helligdager)",
      customRouteTitle: "Tilpasset rute",
      customRouteBody: "Trenger du et annet reisemål?",
      customRoutePrice: "Faste priser",
      customRoutePriceBody: "Fleksible priser basert på ruten",
      customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
      requestQuote: "Bestill nå",
      pricesNote: "Prisene inkluderer MVA. Flere destinasjoner på forespørsel.",
      tableTitle: "Pristabell",
      tableRoute: "Rute",
      tableStandardDay: "Standard dag",
      tableStandardNight: "Standard natt",
      tableBusDay: "Buss dag",
      tableBusNight: "Buss natt",
      tariffsTitle: "Tilpasset ruteprising",
      tariffsName: "Takst",
      tariffsRate: "Pris",
      bookingTitle: "Bestill transfer",
      bookingSubtitle: "Velg kjøretøytype og reserver turen med en gang.",
      routes: {
        airport: "Flyplass",
        gdansk: "Gdańsk sentrum",
        gdynia: "Gdynia sentrum"
      }
    },
    pricingLanding: {
      title: "Priser for Gdańsk flyplasstaxi",
      subtitle: "Fastpris på flyplasstransfer og transparente takster for tilpassede ruter.",
      description: "Sammenlign standard- og busspriser, og bestill eller be om tilbud.",
      cta: "Bestill transfer",
      calculatorCta: "Kalkulator",
      highlights: [
        {
          title: "Fastpris begge veier",
          body: "De oppførte flyplasstrasene har fastpris uten skjulte gebyrer."
        },
        {
          title: "Tilgjengelig 24/7",
          body: "Vi er tilgjengelige hver dag med rask bekreftelse og støtte."
        },
        {
          title: "Buss for grupper",
          body: "Romslige 5–8 seters kjøretøy for familier og større grupper."
        }
      ],
      faqTitle: "Pris-FAQ",
      faq: [
        {
          question: "Er disse prisene faste?",
          answer: "Ja. Flyplasstrasene har fastpris begge veier. Tilpassede ruter prises individuelt."
        },
        {
          question: "Når gjelder nattpris?",
          answer: "Fra 22:00 til 6:00 og på søndager og helligdager."
        },
        {
          question: "Overvåker dere flyforsinkelser?",
          answer: "Ja, vi følger ankomster og justerer hentetiden."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Kortbetaling på forespørsel. Faktura tilgjengelig for bedrifter."
        }
      ]
    },
    pricingCalculator: {
      title: "Pris-kalkulator",
      subtitle: "Oppgi hentested og destinasjon for prisestimat.",
      airportLabel: "Gdańsk lufthavn",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Henting fra adresse",
      destinationCustomLabel: "Destinasjonsadresse",
      pickupLabel: "Hentested",
      pickupPlaceholder: "f.eks. Gdańsk Airport, Słowackiego 200",
      destinationLabel: "Destinasjon",
      destinationPlaceholder: "f.eks. Sopot, Monte Cassino 1",
      distanceLabel: "Distanse",
      resultsTitle: "Estimert pris",
      fixedAllDay: "Hel dag",
      dayRate: "Dagpris",
      nightRate: "Nattpris",
      dayRateLabel: "Dagpris",
      allDayRateLabel: "Døgnpris",
      guaranteedPriceLabel: "Garantert pris",
      standard: "Standard",
      bus: "Buss",
      loading: "Beregner rute...",
      noResult: "Kunne ikke beregne ruten. Prøv en mer presis adresse.",
      longRouteTitle: "Estimert pris for lang rute",
      taximeterLabel: "Taxameter",
      proposedLabel: "Foreslått pris",
      savingsLabel: "Besparelse",
      orderNow: "Bestill nå",
      note: "Prisene er faste. Du kan foreslå en annen pris i bestillingsskjemaet for en annen rute."
    },
    trust: {
      companyTitle: "Firmadetaljer",
      paymentTitle: "Betaling & faktura",
      comfortTitle: "Komfort & sikkerhet",
      paymentBody: "Kontant eller kort på forespørsel. Faktura tilgjengelig for bedrifter.",
      comfortBody: "Barneseter på forespørsel. Profesjonelle, lisensierte sjåfører og dør-til-dør-hjelp."
    },
    footer: {
      description: "Profesjonell flyplasstransport i Tri-City-området. Tilgjengelig 24/7.",
      contactTitle: "Kontakt",
      location: "Gdańsk, Polen",
      bookingNote: "Bestill online, via WhatsApp eller e-post",
      hoursTitle: "Åpningstider",
      hoursBody: "24/7 - tilgjengelig hver dag",
      hoursSub: "Flyplasshenting, bytransport og tilpassede ruter",
      routesTitle: "Populære ruter",
      rights: "Alle rettigheter forbeholdt.",
      cookiePolicy: "Informasjonskapsler",
      privacyPolicy: "Personvern"
    },
    cookieBanner: {
      title: "Innstillinger for informasjonskapsler",
      body: "Vi bruker nødvendige informasjonskapsler for å sikre en trygg og pålitelig bestilling. Med ditt samtykke bruker vi også markedsføringskapsler for å måle annonsekonverteringer. Du kan endre valget når som helst ved å tømme nettleserlagringen.",
      readPolicy: "Les retningslinjene",
      decline: "Avslå",
      accept: "Godta informasjonskapsler"
    },
    cookiePolicy: {
      title: "Retningslinjer for informasjonskapsler",
      updated: "Sist oppdatert: 2. januar 2026",
      intro: "Denne nettsiden bruker informasjonskapsler for å fungere pålitelig og holde bestillingen sikker. Med ditt samtykke bruker vi også markedsføringskapsler for å måle konverteringer.",
      sectionCookies: "Hvilke informasjonskapsler vi bruker",
      cookiesList: [
        "Nødvendige informasjonskapsler for sikkerhet og misbruksbeskyttelse.",
        "Preferansekapsler for å huske grunnleggende valg i en økt.",
        "Markedsføringskapsler for å måle konverteringer fra annonser (Google Ads)."
      ],
      sectionManage: "Slik kan du administrere informasjonskapsler",
      manageBody1: "Du kan slette informasjonskapsler når som helst i nettleserinnstillingene. Å blokkere nødvendige kapsler kan forhindre at bestillingsskjemaet fungerer.",
      manageBody2: "Du kan også endre markedsføringssamtykke ved å tømme nettleserlagringen og besøke siden igjen.",
      contact: "Kontakt",
      contactBody: "Hvis du har spørsmål om disse retningslinjene, kontakt oss på"
    },
    privacyPolicy: {
      title: "Personvern",
      updated: "Sist oppdatert: 2. januar 2026",
      intro: "Denne personvernerklæringen forklarer hvordan Taxi Airport Gdańsk samler inn og behandler personopplysninger.",
      controllerTitle: "Behandlingsansvarlig",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Polen\nE-post:",
      dataTitle: "Hvilke data vi samler inn",
      dataList: [
        "Kontaktopplysninger som navn, e-postadresse og telefonnummer.",
        "Bestillingsdetaljer som hentested, dato, tid, flynummer og notater.",
        "Tekniske data som IP-adresse og grunnleggende nettleserinformasjon for sikkerhet."
      ],
      whyTitle: "Hvorfor vi behandler data",
      whyList: [
        "For å svare på bestillingen og levere tjenesten.",
        "For å kommunisere om bestillinger, endringer eller avbestillinger.",
        "For å oppfylle juridiske forpliktelser og forhindre misbruk."
      ],
      legalTitle: "Rettslig grunnlag",
      legalList: [
        "Oppfyllelse av kontrakt (GDPR art. 6(1)(b)).",
        "Rettslig forpliktelse (GDPR art. 6(1)(c)).",
        "Berettigede interesser (GDPR art. 6(1)(f)), som sikkerhet og svindelforebygging."
      ],
      storageTitle: "Hvor lenge vi lagrer data",
      storageBody: "Vi lagrer bestillingsdata bare så lenge det er nødvendig for tjenesten og juridiske eller regnskapsmessige krav.",
      shareTitle: "Hvem vi deler data med",
      shareBody: "Vi deler kun data med tjenesteleverandører som er nødvendige for bestillingen (f.eks. e-posttjenester). Vi selger ikke personopplysninger.",
      rightsTitle: "Dine rettigheter",
      rightsList: [
        "Innsyn, retting eller sletting av personopplysninger.",
        "Begrensning eller innsigelse mot behandling.",
        "Dataportabilitet der det er relevant.",
        "Rett til å klage til en tilsynsmyndighet."
      ],
      contactTitle: "Kontakt",
      contactBody: "For personvernhenvendelser, kontakt oss på"
    },
    routeLanding: {
      orderNow: "Reserver online nå",
      quickLinks: "Quick links",
      pricingLink: "Se priser",
      orderLinks: {
        airportGdansk: "Book airport → Gdańsk",
        airportSopot: "Book airport → Sopot",
        airportGdynia: "Book airport → Gdynia",
        custom: "Custom route"
      },
      seoParagraph: (route) => `Gdansk airport taxi for ruten ${route}. Faste priser, 24/7 service, meet & greet og rask bekreftelse.`,
      pricingTitle: "Eksempelpriser",
      pricingSubtitle: (route) => `Standardbil for ruten ${route}`,
      vehicleLabel: "Standardbil",
      dayLabel: "Dagpris",
      nightLabel: "Nattpris",
      currency: "PLN",
      pricingNote: "Prisene inkluderer MVA. Nattpris gjelder 22:00–06:00 samt søndager og helligdager.",
      includedTitle: "Dette er inkludert",
      includedList: [
        "Meet & greet på flyplassen med tydelige instrukser.",
        "Flysporing og fleksibel hentetid.",
        "Fast pris begge veier uten skjulte gebyrer.",
        "Profesjonelle, engelsktalende sjåfører."
      ],
      destinationsTitle: "Populære destinasjoner",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hvor raskt er bekreftelsen?",
          answer: "De fleste bestillinger bekreftes innen 5–10 minutter via e-post."
        },
        {
          question: "Sporer dere fly?",
          answer: "Ja, vi følger ankomster og tilpasser hentetid."
        },
        {
          question: "Kan jeg avbestille?",
          answer: "Du kan avbestille via lenken i bekreftelses-e-posten."
        },
        {
          question: "Tilbyr dere barneseter?",
          answer: "Ja, barneseter er tilgjengelig på forespørsel ved bestilling."
        },
        {
          question: "Hvordan kan jeg betale?",
          answer: "Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
        },
        {
          question: "Hvor møter jeg sjåføren?",
          answer: "Du får tydelige hentebeskrivelser og kontaktinfo i bekreftelses-e-posten."
        }
      ]
    },
    countryLanding: {
      title: "Flyplasstransport Gdańsk for reisende fra Norge",
      description: "Privat flyplasstransport i Gdańsk med faste priser, døgnåpen henting og rask bekreftelse.",
      intro: "Passer for fly fra Norge til Gdańsk lufthavn (GDN). Bestill online og få rask bekreftelse.",
      ctaPrimary: "Bestill transport",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor bestille på forhånd",
      highlights: [
        "Meet & greet med tydelige henteinstruksjoner.",
        "Flysporing og fleksibel hentetid.",
        "Faste priser i PLN uten skjulte gebyrer.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
      ],
      airportsTitle: "Vanlige avreiseflyplasser (Norge)",
      airports: [
        "Oslo Gardermoen (OSL)",
        "Bergen (BGO)",
        "Stavanger (SVG)",
        "Trondheim (TRD)",
        "Tromsø (TOS)"
      ],
      faqTitle: "FAQ for reisende fra Norge",
      faq: [
        {
          question: "Kan jeg betale i NOK?",
          answer: "Prisene er i PLN. Kortbetaling blir automatisk konvertert av banken din."
        },
        {
          question: "Får jeg kvittering eller faktura?",
          answer: "Ja, legg det til i bestillingen, så sender vi dokumentet på e-post."
        },
        {
          question: "Sporer dere fly?",
          answer: "Ja, vi følger ankomster og justerer hentetid."
        },
        {
          question: "Hvor raskt får jeg bekreftelse?",
          answer: "De fleste bestillinger bekreftes innen 5–10 minutter på e-post."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Flyplasstransport Gdańsk (${airport})`,
      description: (city, airport) => `Privat transport fra ${airport} til Gdańsk, Sopot og Gdynia. Faste priser og henting 24/7.`,
      intro: (city, airport) => `Direktefly fra ${airport} til Gdańsk er sesongbaserte. Bestill transport på forhånd.`,
      ctaPrimary: "Bestill transport",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor bestille på forhånd",
      highlights: [
        "Meet & greet med tydelige henteinstruksjoner.",
        "Flysporing og fleksibel hentetid.",
        "Faste priser i PLN uten skjulte gebyrer.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
      ],
      routeTitle: (airport) => `Fra ${airport} til Gdańsk`,
      routeBody: (airport) => `Vi henter ankomster fra ${airport} og kjører deg til Gdańsk, Sopot og Gdynia.`,
      destinationsTitle: "Populære destinasjoner i Tri-City",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Finnes det direktefly fra {city} til Gdańsk?",
          answer: "Direktefly er sesongbaserte. Sjekk gjeldende rutetider før du reiser."
        },
        {
          question: "Hvordan møter jeg sjåføren?",
          answer: "Du får henteinstruksjoner og kontaktinfo i bekreftelses-e-posten."
        },
        {
          question: "Sporer dere fly?",
          answer: "Ja, vi følger ankomster og justerer hentetid."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Ja, kortbetaling er mulig. Kontant på forespørsel."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Faste priser og tilgjengelighet 24/7.",
      intro: "Taxi Gdańsk for flyplasstransport og bykjøring. Profesjonelle sjåfører, rask bekreftelse og klare priser.",
      ctaPrimary: "Bestill taxi",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor velge oss",
      highlights: [
        "Faste priser uten skjulte gebyrer.",
        "Tilgjengelig 24/7 for flyplass og bykjøring.",
        "Flysporing og fleksibel hentetid.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
      ],
      serviceAreaTitle: "Serviceområde",
      serviceArea: [
        "Gdańsk gamleby og sentrum",
        "Gdańsk Wrzeszcz og Oliwa",
        "Gdańsk flyplass (GDN)",
        "Sopot og Gdynia"
      ],
      routesTitle: "Populære taxi-ruter",
      routes: [
        "Gdańsk flyplass → gamlebyen",
        "Gdańsk flyplass → Sopot",
        "Gdańsk flyplass → Gdynia",
        "Gamlebyen → Gdańsk flyplass"
      ],
      cityRoutesTitle: "Taxipriser fra Gdańsk lufthavn",
      cityRoutesDescription: "Sjekk aktuell pris fra Gdańsk lufthavn til disse stedene.",
      cityRoutesItem: (destination) => `Taxipris fra Gdańsk lufthavn til ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hvor raskt er bekreftelsen?",
          answer: "De fleste bestillinger bekreftes innen 5–10 minutter via e-post."
        },
        {
          question: "Har dere faste priser?",
          answer: "Ja, flyplassruter har faste priser begge veier."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Ja, kortbetaling er mulig. Kontant på forespørsel."
        },
        {
          question: "Sporer dere fly?",
          answer: "Ja, vi følger ankomster og justerer hentetid."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Vennligst oppgi et gyldig telefonnummer (kun tall).",
        phoneLength: "Vennligst oppgi et gyldig telefonnummer (7–15 sifre, valgfri +).",
        email: "Vennligst oppgi en gyldig e-postadresse.",
        datePast: "Velg dagens dato eller en fremtidig dato."
      },
      rate: {
        day: "Dagpris",
        night: "Nattpris",
        reasonDay: "standard dagpris",
        reasonLate: "henting etter 21:30 eller før 5:30",
        reasonHoliday: "søndag/helligdag",
        banner: (label, price, reason) => `Brukte ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Kunne ikke sende bestillingen. Prøv igjen.",
      submitNetworkError: "Nettverksfeil ved innsending. Prøv igjen.",
      submittedTitle: "Bestilling mottatt",
      submittedBody: "Takk! Forespørselen din er i kø. Vent på bekreftelse – vanligvis 5–10 minutter. Du får en e-post snart.",
      awaiting: "Venter på bekreftelse...",
      totalPrice: "Totalpris:",
      orderNumber: "Bestilling #:",
      orderId: "Bestillings-ID:",
      manageLink: "Administrer eller rediger bestillingen",
      title: "Bestill transport",
      date: "Dato",
      pickupTime: "Hentetid",
      pickupType: "Hentetype",
      pickupTypeHint: "Velg hentetype for å fortsette.",
      airportPickup: "Henting på flyplass",
      addressPickup: "Henting på adresse",
      signServiceTitle: "Mottak ved ankomst",
      signServiceSign: "Møt med navneskilt",
      signServiceFee: "+20 PLN lagt til sluttprisen",
      signServiceSelf: "Jeg finner sjåføren selv på parkeringen",
      signServiceSelfNote: "Sjåføren kontakter deg på WhatsApp eller telefon, og dere møtes.",
      signText: "Tekst på skilt",
      signPlaceholder: "Tekst som vises på skiltet",
      signHelp: "Sjåføren venter med skilt til du forlater ankomsthallen",
      signPreview: "Skiltforhåndsvisning:",
      signEmpty: "Navnet ditt vises her",
      flightNumber: "Flynummer",
      flightPlaceholder: "f.eks. LO123",
      pickupAddress: "Henteadresse",
      pickupPlaceholder: "Skriv inn full henteadresse",
      passengers: "Antall passasjerer",
      passengerLabel: (count) => `${count} ${count === 1 ? "person" : "personer"}`,
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stor bagasje",
      luggageNo: "Nei",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformasjon",
      fullName: "Fullt navn",
      namePlaceholder: "Ditt navn",
      phoneNumber: "Telefonnummer",
      email: "E-postadresse",
      emailPlaceholder: "din@epost.com",
      emailHelp: "Du mottar en bekreftelses-e-post med lenke for endring/avbestilling",
      notesTitle: "Tilleggsnotater (valgfritt)",
      notesPlaceholder: "Spesielle ønsker eller ekstra informasjon...",
      notesHelp: "F.eks. barnesete, ventetid, spesielle instruksjoner",
      submitting: "Sender...",
      formIncomplete: "Fyll ut skjemaet for å fortsette",
      missingFields: (fields) => `Vennligst fyll ut: ${fields}.`,
      reassurance: "Ingen forhåndsbetaling. Gratis avbestilling. Bekreftelse på 5–10 min.",
      confirmOrder: (price) => `Bekreft bestilling - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Vennligst oppgi et gyldig telefonnummer (kun tall).",
        phoneLength: "Vennligst oppgi et gyldig telefonnummer (7–15 sifre, valgfri +).",
        email: "Vennligst oppgi en gyldig e-postadresse.",
        datePast: "Velg dagens dato eller en fremtidig dato."
      },
      submitError: "Kunne ikke sende tilbudsforespørsel. Prøv igjen.",
      submitNetworkError: "Nettverksfeil ved innsending av tilbudsforespørsel. Prøv igjen.",
      submittedTitle: "Tilbudsforespørsel mottatt!",
      submittedBody: "Takk for forespørselen. Du vil få e-post innen 5-10 minutter om tilbudet er akseptert eller avslått.",
      manageLink: "Administrer bestillingen",
      title: "Be om tilpasset tilbud",
      subtitle: "Foreslå din pris og få svar innen 5-10 minutter",
      requestButton: "Be om tilbud",
      requestAnother: "Be om et nytt tilbud",
      toggleDescription: "Oppgi detaljene og foreslå en pris. Du får svar innen 5-10 minutter per e-post.",
      pickupType: "Hentetype",
      airportPickup: "Henting på flyplass",
      addressPickup: "Henting på adresse",
      lockMessage: "Velg hentetype for å låse opp resten av skjemaet.",
      pickupAddress: "Henteadresse",
      pickupPlaceholder: "Skriv inn henteadresse (f.eks. Gdańsk Airport, ul. Słowackiego 200)",
      pickupAutoNote: "Henteadresse på flyplass settes automatisk",
      destinationAddress: "Destinasjonsadresse",
      destinationPlaceholder: "Skriv inn destinasjon (f.eks. Gdańsk Centrum, ul. Długa 1)",
      price: "Pris",
      proposedPriceLabel: "Din foreslåtte pris (PLN)",
      taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
      tariff1: "Takst 1 (by, 6–22): 3.90 PLN/km.",
      tariff2: "Takst 2 (by, 22–6): 5.85 PLN/km.",
      tariff3: "Takst 3 (utenfor by, 6–22): 7.80 PLN/km.",
      tariff4: "Takst 4 (utenfor by, 22–6): 11.70 PLN/km.",
      autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
      fixedPriceHint: "Hvis du ønsker fastpris, klikk her og fyll inn.",
      pricePlaceholder: "Skriv inn ditt tilbud i PLN (f.eks. 150)",
      priceHelp: "Foreslå din pris. Vi vurderer og svarer innen 5-10 minutter.",
      fixedRouteChecking: "Checking if this route qualifies for a fixed price...",
      fixedRouteTitle: "Fixed price available",
      fixedRouteBody: (route, price) => `${route} - fixed price ${price} PLN.`,
      fixedRouteCta: "Book fixed price",
      fixedRouteHint: "Use the fixed-price booking for the fastest confirmation.",
      fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
      fixedRouteAllDay: "All-day rate applies",
      fixedRouteDay: "Day rate applies",
      fixedRouteNight: "Night rate applies",
      fixedRouteLocked: "This route qualifies for a fixed price. Please book via the fixed-price form.",
      fixedRouteComputed: (price) => `Fixed price calculated: ${price} PLN`,
      fixedRouteFooter: (price) => `Book transfer - ${price} PLN`,
      longRouteTitle: "Long route estimate",
      longRouteDistance: (distance) => `Distance: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
      longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
      longRouteNote: "You can still enter your own price below.",
      date: "Dato",
      pickupTime: "Hentetid",
      signServiceTitle: "Mottak ved ankomst",
      signServiceSign: "Møt med navneskilt",
      signServiceFee: "+20 PLN lagt til sluttprisen",
      signServiceSelf: "Jeg finner sjåføren selv på parkeringen",
      signServiceSelfNote: "Sjåføren kontakter deg på WhatsApp eller telefon, og dere møtes.",
      signText: "Tekst på skilt",
      signPlaceholder: "Tekst som vises på skiltet",
      signHelp: "Sjåføren venter med skilt til du forlater ankomsthallen",
      signPreview: "Skiltforhåndsvisning:",
      signEmpty: "Navnet ditt vises her",
      flightNumber: "Flynummer",
      flightPlaceholder: "f.eks. LO123",
      passengers: "Antall passasjerer",
      passengersOptions: ["1 person", "2 personer", "3 personer", "4 personer", "5+ personer"],
      largeLuggage: "Stor bagasje",
      luggageNo: "Nei",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformasjon",
      fullName: "Fullt navn",
      namePlaceholder: "Ditt navn",
      phoneNumber: "Telefonnummer",
      email: "E-postadresse",
      emailPlaceholder: "din@epost.com",
      emailHelp: "Du får svar innen 5-10 minutter",
      notesTitle: "Tilleggsnotater (valgfritt)",
      notesPlaceholder: "Spesielle ønsker eller ekstra informasjon...",
      notesHelp: "F.eks. barnesete, ventetid, spesielle instruksjoner",
      submitting: "Sender...",
      formIncomplete: "Fyll ut skjemaet for å fortsette",
      missingFields: (fields) => `Vennligst fyll ut: ${fields}.`,
      submit: "Send tilbudsforespørsel"
    },
    manageOrder: {
      errors: {
        load: "Kunne ikke laste bestillingen.",
        loadNetwork: "Nettverksfeil ved lasting av bestilling.",
        save: "Kunne ikke lagre endringer.",
        saveNetwork: "Nettverksfeil ved lagring av endringer.",
        cancel: "Kunne ikke avbestille bestilling.",
        cancelNetwork: "Nettverksfeil ved avbestilling.",
        copySuccess: "Kopiert til utklippstavlen",
        copyFail: "Kunne ikke kopiere til utklippstavlen",
        emailRequired: "Vennligst oppgi e-postadressen din."
      },
      loading: "Laster bestillingen din...",
      accessTitle: "Få tilgang til bestillingen",
      accessBody: "Skriv inn e-postadressen brukt ved bestilling.",
      accessPlaceholder: "du@example.com",
      accessAction: "Fortsett",
      accessChecking: "Sjekker...",
      cancelledTitle: "Bestilling avbestilt",
      cancelledBody: "Bestillingen er avbestilt. Hvis dette var en feil, lag en ny bestilling.",
      manageTitle: "Administrer transporten",
      copyAction: "Kopier",
      orderLabel: "Bestilling #",
      orderIdLabel: "Bestillings-ID",
      detailsUpdatedTitle: "Detaljer oppdatert",
      detailsUpdatedBody: (date, time) => `Takk! Detaljene er oppdatert. Transporten er bekreftet for ${date} kl ${time}. Vi sees da.`,
      updateSubmittedTitle: "Oppdatering sendt",
      updateSubmittedBody: "Oppdateringsforespørsel sendt. Vi vurderer den snart.",
      awaiting: "Venter på bekreftelse...",
      transferRoute: "Transportrute",
      priceLabel: "Pris:",
      taximeterTitle: "Price calculated by taximeter",
      taximeterRates: "View taximeter rates",
      tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
      statusConfirmed: "Bekreftet",
      statusCompleted: "Fullført",
      statusFailed: "Ikke fullført",
      statusRejected: "Avslått",
      statusPriceProposed: "Pris foreslått",
      statusPending: "Venter",
      bookingDetails: "Bestillingsdetaljer",
      editDetails: "Rediger detaljer",
      updateRequested: "Felt som må oppdateres",
      confirmedEditNote: "Redigering av bekreftet bestilling sendes tilbake for godkjenning.",
      updateFieldsNote: "Oppdater de markerte feltene og lagre endringene.",
      confirmedNote: "Denne bestillingen er bekreftet.",
      completedNote: "Denne bestillingen er markert som fullført.",
      failedNote: "Denne bestillingen er markert som ikke fullført.",
      priceProposedNote: "En ny pris er foreslått. Sjekk e-post for å godkjenne eller avslå.",
      rejectedNote: "Denne bestillingen er avslått. Redigering er deaktivert, men du kan fortsatt avbestille.",
      rejectionReasonLabel: "Årsak:",
      date: "Dato",
      pickupTime: "Hentetid",
      signServiceTitle: "Airport arrival pickup",
      signServiceSign: "Meet with a name sign",
      signServiceFee: "+20 PLN added to final price",
      signServiceSelf: "Find the driver myself at the parking",
      signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
      signText: "Tekst på skilt",
      flightNumber: "Flynummer",
      pickupAddress: "Henteadresse",
      passengers: "Antall passasjerer",
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stor bagasje",
      luggageNo: "Nei",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformasjon",
      fullName: "Fullt navn",
      phoneNumber: "Telefonnummer",
      email: "E-postadresse",
      notesTitle: "Tilleggsnotater (valgfritt)",
      saveChanges: "Lagre endringer",
      cancelEdit: "Avbryt",
      editBooking: "Rediger bestilling",
      cancelBooking: "Avbestill bestilling",
      changesNotice: "Endringer bekreftes via e-post. For hasteendringer, kontakt booking@taxiairportgdansk.com",
      updateRequestNote: "Bestillingen er oppdatert. Vennligst gjennomgå og bekreft endringene.",
      rejectNote: "Denne bestillingen er avslått. Kontakt support hvis du har spørsmål.",
      cancelPromptTitle: "Avbestille bestilling?",
      cancelPromptBody: "Er du sikker på at du vil avbestille? Dette kan ikke angres.",
      confirmCancel: "Ja, avbestill",
      keepBooking: "Behold bestilling",
      copyOrderLabel: "Bestilling #",
      copyOrderIdLabel: "Bestillings-ID"
    },
    adminOrders: {
      title: "Admin-bestillinger",
      subtitle: "Alle nylige bestillinger og status.",
      loading: "Laster bestillinger...",
      missingToken: "Admin-token mangler.",
      errorLoad: "Kunne ikke laste bestillinger.",
      filters: {
        all: "All",
        active: "In progress",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      statuses: {
        pending: "Pending",
        confirmed: "Confirmed",
        price_proposed: "Price proposed",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      columns: {
        order: "Bestilling",
        pickup: "Henting",
        customer: "Kunde",
        price: "Pris",
        status: "Status",
        open: "Åpne"
      },
      empty: "Ingen bestillinger funnet.",
      pendingPrice: (price) => `Venter: ${price} PLN`,
      view: "Vis"
    },
    adminOrder: {
      title: "Admin bestillingsdetaljer",
      subtitle: "Administrer, bekreft eller avslå denne bestillingen.",
      back: "Tilbake til alle bestillinger",
      loading: "Laster bestilling...",
      missingToken: "Admin-token mangler.",
      errorLoad: "Kunne ikke laste bestilling.",
      updated: "Bestilling oppdatert.",
      updateError: "Kunne ikke oppdatere bestilling.",
      statusUpdated: "Bestillingsstatus oppdatert.",
      updateRequestSent: "Oppdateringsforespørsel sendt til kunde.",
      updateRequestError: "Kunne ikke sende oppdateringsforespørsel.",
      updateRequestSelect: "Velg minst ett felt for oppdatering.",
      orderLabel: "Bestilling",
      idLabel: "ID",
      customerLabel: "Kunde",
      pickupLabel: "Henting",
      priceLabel: "Pris",
      pendingPrice: (price) => `Venter: ${price} PLN`,
      additionalInfo: "Tilleggsinformasjon",
      passengers: "Passasjerer:",
      largeLuggage: "Stor bagasje:",
      pickupType: "Hentetype:",
      signService: "Hentevalg:",
      signServiceSign: "Møt med navneskilt",
      signServiceSelf: "Finn sjåføren selv",
      signFee: "Skiltgebyr:",
      flightNumber: "Flynummer:",
      signText: "Tekst på skilt:",
      route: "Rute:",
      notes: "Notater:",
      adminActions: "Admin-handlinger",
      confirmOrder: "Bekreft bestilling",
      rejectOrder: "Avslå bestilling",
      proposePrice: "Foreslå ny pris (PLN)",
      sendPrice: "Send prisforslag",
      rejectionReason: "Avslagsgrunn (valgfritt)",
      requestUpdate: "Be om oppdatering fra kunden",
      requestUpdateBody: "Velg feltene kunden skal oppdatere. De vil få en e-post med lenke.",
      fieldPhone: "Telefonnummer",
      fieldEmail: "E-postadresse",
      fieldFlight: "Flynummer",
      requestUpdateAction: "Be om oppdatering",
      cancelConfirmedTitle: "Confirmed order cancellation",
      cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
      cancelConfirmedAction: "Cancel confirmed order",
      cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
      cancelConfirmedSuccess: "Order cancelled.",
      deleteRejectedTitle: "Delete rejected order",
      deleteRejectedBody: "Remove this rejected order permanently.",
      deleteRejectedAction: "Delete rejected order",
      deleteRejectedConfirm: "Delete this rejected order permanently?",
      deleteRejectedSuccess: "Order deleted.",
      completionTitle: "Fullføringsstatus",
      markCompleted: "Merk som fullført",
      markCompletedConfirm: "Mark this order as completed?",
      markFailed: "Merk som ikke fullført",
      markFailedConfirm: "Mark this order as not completed?"
    },
    pages: {
      gdanskTaxi: {
        title: "Gdańsk flyplass taxi",
        description: "Bestill en rask og pålitelig flyplasstaxi fra Gdańsk flyplass. Fast pris begge veier, profesjonelle sjåfører og rask bekreftelse.",
        route: "Gdańsk flyplass",
        examples: ["Gdańsk gamleby", "Gdańsk Oliwa", "Gdańsk hovedstasjon", "Brzeźno strand"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Transfer fra Gdańsk flyplass til Sopot",
        description: "Privat transfer mellom Gdańsk flyplass og Sopot med fast pris begge veier og flysporing.",
        route: "Gdańsk flyplass ↔ Sopot",
        examples: ["Sopot Pier", "Sopot sentrum", "Sopot hoteller", "Sopot jernbanestasjon"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Transfer fra Gdańsk flyplass til Gdynia",
        description: "Komfortabel transfer mellom Gdańsk flyplass og Gdynia med fast pris begge veier.",
        route: "Gdańsk flyplass ↔ Gdynia",
        examples: ["Gdynia sentrum", "Gdynia havn", "Gdynia hoteller", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  },
  sv: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Kolla pris och boka TAXI",
      orderNow: "Boka nu",
      close: "Stäng",
      noPrepayment: "Ingen förskottsbetalning",
      backToHome: "← Tillbaka till startsidan",
      notFoundTitle: "Sidan hittades inte",
      notFoundBody: "Sidan du söker finns inte eller har flyttats.",
      notFoundCta: "Gå till startsidan",
      notFoundSupport: "Om detta är ett fel, kontakta oss:",
      notFoundRequested: "Begärd URL",
      notFoundPopular: "Populära sidor",
      actualBadge: "AKTUELL",
      priceFrom: "från",
      perNight: "nattetid",
      perDay: "till centrum (dag)",
      whatsappMessage: "Hej Taxi Airport Gdańsk, jag vill boka en transfer."
    },
    navbar: {
      home: "Hem",
      fleet: "Vår flotta",
      airportTaxi: "Gdańsk flygplats taxi",
      airportSopot: "Flygplats ↔ Sopot",
      airportGdynia: "Flygplats ↔ Gdynia",
      prices: "Priser",
      orderNow: "BOKA NU",
      language: "Språk"
    },
    hero: {
      promo: {
        dayPrice: "ENDAST 100 PLN",
        dayLabel: "till centrum (dag)",
        nightPrice: "120 PLN",
        nightLabel: "nattetid"
      },
      logoAlt: "Taxi Airport Gdańsk - Flygplatstransfer & limousineservice",
      orderViaEmail: "Beställ via e-post",
      headline: "Gdańsk flygplats taxi – transfer till Gdańsk, Sopot och Gdynia",
      subheadline: "Gdansk airport taxi med fasta priser, 24/7 och snabb bekräftelse.",
      whyChoose: "Varför välja Taxi Airport Gdańsk",
      benefits: "Fördelar",
      benefitsList: {
        flightTrackingTitle: "Flygspårning",
        flightTrackingBody: "Vi övervakar ankomster och justerar upphämtningstid automatiskt.",
        meetGreetTitle: "Meet & greet",
        meetGreetBody: "Professionella förare, tydlig kommunikation och hjälp med bagage.",
        fastConfirmationTitle: "Snabb bekräftelse",
        fastConfirmationBody: "De flesta bokningar bekräftas inom 5–10 minuter.",
        flexiblePaymentsTitle: "Flexibla betalningar",
        flexiblePaymentsBody: "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
        freePrebookingTitle: "Gratis förbokning",
        freePrebookingBody: "Avboka när som helst kostnadsfritt. Helt automatiserat.",
        fixedPriceTitle: "Fastprisgaranti",
        fixedPriceBody: "Fast pris åt båda håll. Priset du bokar är priset du betalar.",
        localExpertiseTitle: "Lokal expertis",
        localExpertiseBody: "Erfarna Trójmiasto-förare som kan de snabbaste rutterna.",
        assistanceTitle: "24/7 hjälp",
        assistanceBody: "Alltid tillgänglig före, under och efter din resa."
      },
      fleetTitle: "Vår flotta",
      fleetLabel: "Fordon",
      standardCarsTitle: "Standardbilar",
      standardCarsBody: "1-4 passagerare | Bekväma sedaner och SUV:ar",
      busTitle: "Och fler bussar",
      busBody: "5-8 passagerare | Perfekt för större grupper"
    },
    vehicle: {
      title: "Välj fordon",
      subtitle: "Välj fordonstyp som passar gruppens storlek",
      standardTitle: "Standardbil",
      standardPassengers: "1-4 passagerare",
      standardDescription: "Perfekt för ensamresenärer, par och små familjer",
      busTitle: "BUS Service",
      busPassengers: "5-8 passagerare",
      busDescription: "Idealisk för större grupper och familjer med extra bagage",
      examplePrices: "Exempelpriser:",
      airportGdansk: "Flygplats ↔ Gdańsk",
      airportSopot: "Flygplats ↔ Sopot",
      airportGdynia: "Flygplats ↔ Gdynia",
      selectStandard: "Välj standardbil",
      selectBus: "Välj BUS Service"
    },
    pricing: {
      back: "Tillbaka till fordonsval",
      titleStandard: "Standardbil (1-4 passagerare)",
      titleBus: "BUS Service (5-8 passagerare)",
      description: "Fasta priser åt båda håll (till och från flygplatsen). Inga dolda avgifter. Nattaxa gäller 22–6 samt söndagar och helgdagar.",
      dayRate: "Dagpris",
      nightRate: "Nattpris",
      sundayNote: "(Söndagar och helgdagar)",
      customRouteTitle: "Anpassad rutt",
      customRouteBody: "Behöver du en annan destination?",
      customRoutePrice: "Fasta priser",
      customRoutePriceBody: "Flexibel prissättning baserat på din rutt",
      customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
      requestQuote: "Boka nu",
      pricesNote: "Priserna inkluderar moms. Fler destinationer på begäran.",
      tableTitle: "Pristabell",
      tableRoute: "Rutt",
      tableStandardDay: "Standard dag",
      tableStandardNight: "Standard natt",
      tableBusDay: "Buss dag",
      tableBusNight: "Buss natt",
      tariffsTitle: "Priser för anpassade rutter",
      tariffsName: "Taxa",
      tariffsRate: "Pris",
      bookingTitle: "Boka transfer",
      bookingSubtitle: "Välj fordonstyp och boka direkt.",
      routes: {
        airport: "Flygplats",
        gdansk: "Gdańsk centrum",
        gdynia: "Gdynia centrum"
      }
    },
    pricingLanding: {
      title: "Priser för Gdańsk flygplatstaxi",
      subtitle: "Fasta priser för flygplatstransfer och tydlig prissättning för anpassade rutter.",
      description: "Jämför standard- och busspriser, boka direkt eller be om offert.",
      cta: "Boka transfer",
      calculatorCta: "Kalkylator",
      highlights: [
        {
          title: "Fasta priser åt båda håll",
          body: "De listade flygplatsrutterna har fast pris utan dolda avgifter."
        },
        {
          title: "Tillgängligt 24/7",
          body: "Vi är tillgängliga varje dag med snabb bekräftelse och support."
        },
        {
          title: "Buss för grupper",
          body: "Rymliga 5–8-sitsiga fordon för familjer och större grupper."
        }
      ],
      faqTitle: "Pris-FAQ",
      faq: [
        {
          question: "Är dessa priser fasta?",
          answer: "Ja. Flygplatsrutterna har fasta priser åt båda håll. Anpassade rutter prissätts individuellt."
        },
        {
          question: "När gäller nattaxa?",
          answer: "22:00–6:00 samt söndagar och helgdagar."
        },
        {
          question: "Följer ni flygförseningar?",
          answer: "Ja, vi följer ankomster och justerar upphämtningstiden."
        },
        {
          question: "Kan jag betala med kort?",
          answer: "Kortbetalning på begäran. Faktura finns för företagskunder."
        }
      ]
    },
    pricingCalculator: {
      title: "Prisräknare",
      subtitle: "Ange upphämtning och destination för en prisuppskattning.",
      airportLabel: "Gdańsk flygplats",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Upphämtning från adress",
      destinationCustomLabel: "Destinationsadress",
      pickupLabel: "Upphämtningsplats",
      pickupPlaceholder: "t.ex. Gdańsk Airport, Słowackiego 200",
      destinationLabel: "Destination",
      destinationPlaceholder: "t.ex. Sopot, Monte Cassino 1",
      distanceLabel: "Avstånd",
      resultsTitle: "Uppskattat pris",
      fixedAllDay: "Hela dagen",
      dayRate: "Dagpris",
      nightRate: "Nattpris",
      dayRateLabel: "Dagpris",
      allDayRateLabel: "Heldagspris",
      guaranteedPriceLabel: "Garanterat pris",
      standard: "Standard",
      bus: "Buss",
      loading: "Beräknar rutt...",
      noResult: "Kunde inte beräkna rutten. Prova en mer exakt adress.",
      longRouteTitle: "Uppskattning för lång rutt",
      taximeterLabel: "Taxameter",
      proposedLabel: "Föreslaget pris",
      savingsLabel: "Besparing",
      orderNow: "Boka nu",
      note: "Priserna är fasta. Du kan föreslå ett annat pris i beställningsformuläret för en annan rutt."
    },
    trust: {
      companyTitle: "Företagsuppgifter",
      paymentTitle: "Betalning & faktura",
      comfortTitle: "Komfort & säkerhet",
      paymentBody: "Kontant eller kort på begäran. Fakturor tillgängliga för företagskunder.",
      comfortBody: "Barnstolar på begäran. Professionella, licensierade förare och dörr-till-dörr-hjälp."
    },
    footer: {
      description: "Professionell flygplatstransfer i Trójmiasto-området. Tillgänglig 24/7.",
      contactTitle: "Kontakt",
      location: "Gdańsk, Polen",
      bookingNote: "Boka online, via WhatsApp eller e-post",
      hoursTitle: "Öppettider",
      hoursBody: "24/7 - tillgänglig varje dag",
      hoursSub: "Flygplatshämtning, stadstransfer och skräddarsydda rutter",
      routesTitle: "Populära rutter",
      rights: "Alla rättigheter förbehållna.",
      cookiePolicy: "Kakor",
      privacyPolicy: "Integritetspolicy"
    },
    cookieBanner: {
      title: "Cookie-inställningar",
      body: "Vi använder nödvändiga cookies för att hålla bokningsprocessen säker och pålitlig. Med ditt samtycke använder vi även marknadsföringscookies för att mäta konverteringar. Du kan ändra ditt val genom att rensa webbläsarens lagring.",
      readPolicy: "Läs policyn",
      decline: "Avböj",
      accept: "Acceptera cookies"
    },
    cookiePolicy: {
      title: "Cookiepolicy",
      updated: "Senast uppdaterad: 2 januari 2026",
      intro: "Denna webbplats använder cookies för att fungera pålitligt och hålla din bokning säker. Med ditt samtycke använder vi även marknadsföringscookies för att mäta konverteringar.",
      sectionCookies: "Vilka cookies vi använder",
      cookiesList: [
        "Nödvändiga cookies för säkerhet och missbruksförebyggande.",
        "Preferenscookies för att komma ihåg grundläggande val under en session.",
        "Marknadsföringscookies för att mäta konverteringar från annonser (Google Ads)."
      ],
      sectionManage: "Så hanterar du cookies",
      manageBody1: "Du kan ta bort cookies när som helst i webbläsarens inställningar. Att blockera nödvändiga cookies kan göra att bokningsformuläret inte fungerar.",
      manageBody2: "Du kan även ändra ditt marknadsföringsval genom att rensa webbläsarens lagring och besöka webbplatsen igen.",
      contact: "Kontakt",
      contactBody: "Om du har frågor om denna policy, kontakta oss på"
    },
    privacyPolicy: {
      title: "Integritetspolicy",
      updated: "Senast uppdaterad: 2 januari 2026",
      intro: "Denna integritetspolicy förklarar hur Taxi Airport Gdańsk samlar in och behandlar personuppgifter när du använder våra tjänster.",
      controllerTitle: "Personuppgiftsansvarig",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Polen\nE-post:",
      dataTitle: "Vilka uppgifter vi samlar in",
      dataList: [
        "Kontaktuppgifter såsom namn, e-postadress och telefonnummer.",
        "Bokningsuppgifter såsom upphämtningsplats, datum, tid, flygnummer och noteringar.",
        "Tekniska uppgifter såsom IP-adress och grundläggande webbläsarinformation för säkerhet."
      ],
      whyTitle: "Varför vi behandlar dina uppgifter",
      whyList: [
        "För att svara på din bokning och leverera tjänsten.",
        "För att kommunicera om bokningar, ändringar eller avbokningar.",
        "För att uppfylla lagkrav och förhindra missbruk."
      ],
      legalTitle: "Rättslig grund",
      legalList: [
        "Avtalsuppfyllelse (GDPR Art. 6(1)(b)).",
        "Rättslig förpliktelse (GDPR Art. 6(1)(c)).",
        "Berättigat intresse (GDPR Art. 6(1)(f)), såsom säkerhet och bedrägeriförebyggande."
      ],
      storageTitle: "Hur länge vi lagrar data",
      storageBody: "Vi sparar bokningsdata endast så länge det behövs för att leverera tjänsten och uppfylla lagkrav.",
      shareTitle: "Vilka vi delar data med",
      shareBody: "Vi delar endast data med tjänsteleverantörer som behövs för att leverera bokningen (t.ex. e-postleverantörer). Vi säljer inte personuppgifter.",
      rightsTitle: "Dina rättigheter",
      rightsList: [
        "Tillgång, rättelse eller radering av dina personuppgifter.",
        "Begränsning eller invändning mot behandling.",
        "Dataportabilitet där det är tillämpligt.",
        "Rätt att lämna klagomål till en tillsynsmyndighet."
      ],
      contactTitle: "Kontakt",
      contactBody: "För integritetsfrågor, kontakta oss på"
    },
    routeLanding: {
      orderNow: "Boka online nu",
      quickLinks: "Quick links",
      pricingLink: "Se priser",
      orderLinks: {
        airportGdansk: "Book airport → Gdańsk",
        airportSopot: "Book airport → Sopot",
        airportGdynia: "Book airport → Gdynia",
        custom: "Custom route"
      },
      seoParagraph: (route) => `Gdansk airport taxi för rutten ${route}. Fasta priser, 24/7 service, meet & greet och snabb bekräftelse.`,
      pricingTitle: "Exempelpriser",
      pricingSubtitle: (route) => `Standardbil för ${route}`,
      vehicleLabel: "Standardbil",
      dayLabel: "Dagpris",
      nightLabel: "Nattpris",
      currency: "PLN",
      pricingNote: "Priserna inkluderar moms. Nattpris gäller 22:00–06:00 samt söndagar och helgdagar.",
      includedTitle: "Detta ingår",
      includedList: [
        "Meet & greet på flygplatsen med tydliga upphämtningsinstruktioner.",
        "Flygspårning och flexibel upphämtningstid.",
        "Fast pris åt båda håll utan dolda avgifter.",
        "Professionella, engelsktalande förare."
      ],
      destinationsTitle: "Populära destinationer",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hur snabbt är bekräftelsen?",
          answer: "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
        },
        {
          question: "Spårar ni flyg?",
          answer: "Ja, vi övervakar ankomster och justerar upphämtningstiden."
        },
        {
          question: "Kan jag avboka?",
          answer: "Du kan avboka via länken i din bekräftelse-e-post."
        },
        {
          question: "Erbjuder ni barnstolar?",
          answer: "Ja, barnstolar finns tillgängliga på begäran vid bokning."
        },
        {
          question: "Hur kan jag betala?",
          answer: "Du kan betala med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
        },
        {
          question: "Var möter jag chauffören?",
          answer: "Du får tydliga upphämtningsinstruktioner och kontaktinfo i bekräftelsemejlet."
        }
      ]
    },
    countryLanding: {
      title: "Flygplatstransfer Gdańsk för resenärer från Sverige",
      description: "Privat flygplatstransfer i Gdańsk med fasta priser, upphämtning dygnet runt och snabb bekräftelse.",
      intro: "För flyg från Sverige till Gdańsk flygplats (GDN). Boka online och få snabb bekräftelse.",
      ctaPrimary: "Boka transfer",
      ctaSecondary: "Se priser",
      highlightsTitle: "Varför boka i förväg",
      highlights: [
        "Meet & greet med tydliga upphämtningsinstruktioner.",
        "Flygspårning och flexibel upphämtningstid.",
        "Fasta priser i PLN utan dolda avgifter.",
        "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
      ],
      airportsTitle: "Vanliga avgångsflygplatser (Sverige)",
      airports: [
        "Stockholm Arlanda (ARN)",
        "Göteborg (GOT)",
        "Skellefteå (SFT)",
        "Malmö (MMX)"
      ],
      faqTitle: "FAQ för resenärer från Sverige",
      faq: [
        {
          question: "Kan jag betala i SEK?",
          answer: "Priserna är i PLN. Kortbetalningar omräknas automatiskt av din bank."
        },
        {
          question: "Får jag kvitto eller faktura?",
          answer: "Ja, skriv det i bokningen så skickar vi dokumentet via e-post."
        },
        {
          question: "Spårar ni flyg?",
          answer: "Ja, vi övervakar ankomster och justerar upphämtningstiden."
        },
        {
          question: "Hur snabbt får jag bekräftelse?",
          answer: "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Flygplatstransfer Gdańsk (${airport})`,
      description: (city, airport) => `Privat transfer från ${airport} till Gdańsk, Sopot och Gdynia. Fasta priser och upphämtning 24/7.`,
      intro: (city, airport) => `Direktflyg från ${airport} till Gdańsk är säsongsbaserade. Boka transfer i förväg.`,
      ctaPrimary: "Boka transfer",
      ctaSecondary: "Se priser",
      highlightsTitle: "Varför boka i förväg",
      highlights: [
        "Meet & greet med tydliga upphämtningsinstruktioner.",
        "Flygspårning och flexibel upphämtningstid.",
        "Fasta priser i PLN utan dolda avgifter.",
        "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
      ],
      routeTitle: (airport) => `Från ${airport} till Gdańsk`,
      routeBody: (airport) => `Vi hämtar ankomster från ${airport} och kör till Gdańsk, Sopot och Gdynia.`,
      destinationsTitle: "Populära destinationer i Tri-City",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Finns det direktflyg från {city} till Gdańsk?",
          answer: "Direktflyg är säsongsbaserade. Kontrollera aktuell tidtabell före resan."
        },
        {
          question: "Hur möter jag chauffören?",
          answer: "Du får upphämtningsinstruktioner och kontaktinfo i bekräftelsemejlet."
        },
        {
          question: "Spårar ni flyg?",
          answer: "Ja, vi övervakar ankomster och justerar upphämtningstiden."
        },
        {
          question: "Kan jag betala med kort?",
          answer: "Ja, kortbetalning är möjlig. Kontant på begäran."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Fasta priser och tillgänglighet 24/7.",
      intro: "Taxi Gdańsk för flygplatstransfer och stadskörningar. Professionella förare, snabb bekräftelse och tydliga priser.",
      ctaPrimary: "Boka taxi",
      ctaSecondary: "Se priser",
      highlightsTitle: "Varför välja oss",
      highlights: [
        "Fasta priser utan dolda avgifter.",
        "Tillgänglig 24/7 för flygplats och stadskörning.",
        "Flygspårning och flexibel upphämtningstid.",
        "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
      ],
      serviceAreaTitle: "Serviceområde",
      serviceArea: [
        "Gdańsk gamla stan och centrum",
        "Gdańsk Wrzeszcz och Oliwa",
        "Gdańsk flygplats (GDN)",
        "Sopot och Gdynia"
      ],
      routesTitle: "Populära taxirutter",
      routes: [
        "Gdańsk flygplats → gamla stan",
        "Gdańsk flygplats → Sopot",
        "Gdańsk flygplats → Gdynia",
        "Gamla stan → Gdańsk flygplats"
      ],
      cityRoutesTitle: "Taxipriser från Gdańsk flygplats",
      cityRoutesDescription: "Se aktuellt pris från Gdańsk flygplats till dessa orter.",
      cityRoutesItem: (destination) => `Taxipris från Gdańsk flygplats till ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hur snabbt är bekräftelsen?",
          answer: "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
        },
        {
          question: "Har ni fasta priser?",
          answer: "Ja, flygplatsrutter har fasta priser i båda riktningar."
        },
        {
          question: "Kan jag betala med kort?",
          answer: "Ja, kortbetalning är möjlig. Kontant på begäran."
        },
        {
          question: "Spårar ni flyg?",
          answer: "Ja, vi övervakar ankomster och justerar upphämtningstiden."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Ange ett giltigt telefonnummer (endast siffror).",
        phoneLength: "Ange ett giltigt telefonnummer (7–15 siffror, valfri +).",
        email: "Ange en giltig e-postadress.",
        datePast: "Välj dagens datum eller ett framtida datum."
      },
      rate: {
        day: "Dagpris",
        night: "Nattpris",
        reasonDay: "standard dagpris",
        reasonLate: "upphämtning efter 21:30 eller före 5:30",
        reasonHoliday: "söndag/helgdag",
        banner: (label, price, reason) => `Tillämpad ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Det gick inte att skicka beställningen. Försök igen.",
      submitNetworkError: "Nätverksfel vid skickandet. Försök igen.",
      submittedTitle: "Beställning mottagen",
      submittedBody: "Tack! Din förfrågan är i kö. Vänta på bekräftelse – vanligtvis 5–10 minuter. Du får snart ett bekräftelsemail.",
      awaiting: "Väntar på bekräftelse...",
      totalPrice: "Totalpris:",
      orderNumber: "Beställning #:",
      orderId: "Beställnings-ID:",
      manageLink: "Hantera eller redigera beställningen",
      title: "Beställ transfer",
      date: "Datum",
      pickupTime: "Upphämtningstid",
      pickupType: "Upphämtningstyp",
      pickupTypeHint: "Välj upphämtningstyp för att fortsätta.",
      airportPickup: "Upphämtning på flygplats",
      addressPickup: "Upphämtning på adress",
      signServiceTitle: "Mottagning vid ankomst",
      signServiceSign: "Möt med namnskylt",
      signServiceFee: "+20 PLN läggs till slutpriset",
      signServiceSelf: "Jag hittar föraren själv på parkeringen",
      signServiceSelfNote: "Föraren kontaktar dig via WhatsApp eller telefon och ni möts.",
      signText: "Text på skylt",
      signPlaceholder: "Text som visas på skylten",
      signHelp: "Föraren väntar med en skylt tills du lämnar ankomsthallen",
      signPreview: "Skyltförhandsvisning:",
      signEmpty: "Ditt namn visas här",
      flightNumber: "Flygnummer",
      flightPlaceholder: "t.ex. LO123",
      pickupAddress: "Upphämtningsadress",
      pickupPlaceholder: "Ange fullständig upphämtningsadress",
      passengers: "Antal passagerare",
      passengerLabel: (count) => `${count} ${count === 1 ? "person" : "personer"}`,
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stort bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformation",
      fullName: "Fullständigt namn",
      namePlaceholder: "Ditt namn",
      phoneNumber: "Telefonnummer",
      email: "E-postadress",
      emailPlaceholder: "din@email.com",
      emailHelp: "Du får ett bekräftelsemail med länk för att redigera eller avboka",
      notesTitle: "Ytterligare anteckningar (valfritt)",
      notesPlaceholder: "Särskilda önskemål eller extra information...",
      notesHelp: "T.ex. barnstol, väntetid, särskilda instruktioner",
      submitting: "Skickar...",
      formIncomplete: "Fyll i formuläret för att fortsätta",
      missingFields: (fields) => `Vänligen fyll i: ${fields}.`,
      reassurance: "Ingen förskottsbetalning. Gratis avbokning. Bekräftelse inom 5–10 min.",
      confirmOrder: (price) => `Bekräfta beställning - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Ange ett giltigt telefonnummer (endast siffror).",
        phoneLength: "Ange ett giltigt telefonnummer (7–15 siffror, valfri +).",
        email: "Ange en giltig e-postadress.",
        datePast: "Välj dagens datum eller ett framtida datum."
      },
      submitError: "Det gick inte att skicka offertförfrågan. Försök igen.",
      submitNetworkError: "Nätverksfel vid skickandet. Försök igen.",
      submittedTitle: "Offertförfrågan mottagen!",
      submittedBody: "Tack. Du får ett e-postsvar inom 5-10 minuter om erbjudandet accepteras eller avslås.",
      manageLink: "Hantera din beställning",
      title: "Begär anpassad offert",
      subtitle: "Föreslå ditt pris och få svar inom 5-10 minuter",
      requestButton: "Begär offert",
      requestAnother: "Begär en ny offert",
      toggleDescription: "Ange resedetaljer och föreslå ditt pris. Du får svar inom 5-10 minuter.",
      pickupType: "Upphämtningstyp",
      airportPickup: "Upphämtning på flygplats",
      addressPickup: "Upphämtning på adress",
      lockMessage: "Välj upphämtningstyp för att låsa upp resten av formuläret.",
      pickupAddress: "Upphämtningsadress",
      pickupPlaceholder: "Ange upphämtningsadress (t.ex. Gdańsk Airport, ul. Słowackiego 200)",
      pickupAutoNote: "Upphämtningsadress på flygplats sätts automatiskt",
      destinationAddress: "Destinationsadress",
      destinationPlaceholder: "Ange destinationsadress (t.ex. Gdańsk Centrum, ul. Długa 1)",
      price: "Pris",
      proposedPriceLabel: "Ditt föreslagna pris (PLN)",
      taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
      tariff1: "Tariff 1 (stad, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (stad, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (utanför stad, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (utanför stad, 22–6): 11.70 PLN/km.",
      autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
      fixedPriceHint: "Om du vill föreslå fast pris, klicka här och fyll i fältet.",
      pricePlaceholder: "Ange ditt erbjudande i PLN (t.ex. 150)",
      priceHelp: "Föreslå ditt pris för resan. Vi granskar och svarar inom 5-10 minuter.",
      fixedRouteChecking: "Checking if this route qualifies for a fixed price...",
      fixedRouteTitle: "Fixed price available",
      fixedRouteBody: (route, price) => `${route} - fixed price ${price} PLN.`,
      fixedRouteCta: "Book fixed price",
      fixedRouteHint: "Use the fixed-price booking for the fastest confirmation.",
      fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
      fixedRouteAllDay: "All-day rate applies",
      fixedRouteDay: "Day rate applies",
      fixedRouteNight: "Night rate applies",
      fixedRouteLocked: "This route qualifies for a fixed price. Please book via the fixed-price form.",
      fixedRouteComputed: (price) => `Fixed price calculated: ${price} PLN`,
      fixedRouteFooter: (price) => `Book transfer - ${price} PLN`,
      longRouteTitle: "Long route estimate",
      longRouteDistance: (distance) => `Distance: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
      longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
      longRouteNote: "You can still enter your own price below.",
      date: "Datum",
      pickupTime: "Upphämtningstid",
      signServiceTitle: "Mottagning vid ankomst",
      signServiceSign: "Möt med namnskylt",
      signServiceFee: "+20 PLN läggs till slutpriset",
      signServiceSelf: "Jag hittar föraren själv på parkeringen",
      signServiceSelfNote: "Föraren kontaktar dig via WhatsApp eller telefon och ni möts.",
      signText: "Text på skylt",
      signPlaceholder: "Text som visas på skylten",
      signHelp: "Föraren väntar med en skylt tills du lämnar ankomsthallen",
      signPreview: "Skyltförhandsvisning:",
      signEmpty: "Ditt namn visas här",
      flightNumber: "Flygnummer",
      flightPlaceholder: "t.ex. LO123",
      passengers: "Antal passagerare",
      passengersOptions: ["1 person", "2 personer", "3 personer", "4 personer", "5+ personer"],
      largeLuggage: "Stort bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformation",
      fullName: "Fullständigt namn",
      namePlaceholder: "Ditt namn",
      phoneNumber: "Telefonnummer",
      email: "E-postadress",
      emailPlaceholder: "din@email.com",
      emailHelp: "Du får svar inom 5-10 minuter",
      notesTitle: "Ytterligare anteckningar (valfritt)",
      notesPlaceholder: "Särskilda önskemål eller extra information...",
      notesHelp: "T.ex. barnstol, väntetid, särskilda instruktioner",
      submitting: "Skickar...",
      formIncomplete: "Fyll i formuläret för att fortsätta",
      missingFields: (fields) => `Vänligen fyll i: ${fields}.`,
      submit: "Skicka offertförfrågan"
    },
    manageOrder: {
      errors: {
        load: "Det gick inte att ladda beställningen.",
        loadNetwork: "Nätverksfel vid laddning av beställning.",
        save: "Det gick inte att spara ändringar.",
        saveNetwork: "Nätverksfel vid sparande av ändringar.",
        cancel: "Det gick inte att avboka beställningen.",
        cancelNetwork: "Nätverksfel vid avbokning.",
        copySuccess: "Kopierat till urklipp",
        copyFail: "Det gick inte att kopiera",
        emailRequired: "Ange din e-postadress."
      },
      loading: "Laddar din beställning...",
      accessTitle: "Få åtkomst till bokningen",
      accessBody: "Ange e-postadressen som användes vid bokning.",
      accessPlaceholder: "du@example.com",
      accessAction: "Fortsätt",
      accessChecking: "Kontrollerar...",
      cancelledTitle: "Beställning avbokad",
      cancelledBody: "Din beställning har avbokats. Om detta var ett misstag, gör en ny bokning.",
      manageTitle: "Hantera din transfer",
      copyAction: "Kopiera",
      orderLabel: "Beställning #",
      orderIdLabel: "Beställnings-ID",
      detailsUpdatedTitle: "Detaljer uppdaterade",
      detailsUpdatedBody: (date, time) => `Tack! Dina detaljer uppdaterades. Din transfer är fortsatt bekräftad för ${date} kl ${time}. Vi ses då.`,
      updateSubmittedTitle: "Uppdatering skickad",
      updateSubmittedBody: "Din uppdateringsförfrågan skickades. Vi granskar den och återkommer.",
      awaiting: "Väntar på bekräftelse...",
      transferRoute: "Transfersträcka",
      priceLabel: "Pris:",
      pricePending: "Pris bekräftas individuellt",
      taximeterTitle: "Price calculated by taximeter",
      taximeterRates: "View taximeter rates",
      tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
      statusConfirmed: "Bekräftad",
      statusCompleted: "Slutförd",
      statusFailed: "Ej slutförd",
      statusRejected: "Avslagen",
      statusPriceProposed: "Pris föreslaget",
      statusPending: "Väntande",
      bookingDetails: "Bokningsdetaljer",
      editDetails: "Redigera detaljer",
      updateRequested: "Fält som ska uppdateras",
      confirmedEditNote: "Att redigera en bekräftad beställning skickar den tillbaka för godkännande.",
      updateFieldsNote: "Uppdatera de markerade fälten och spara ändringarna.",
      confirmedNote: "Denna beställning är bekräftad.",
      completedNote: "Denna beställning är markerad som slutförd.",
      failedNote: "Denna beställning är markerad som ej slutförd.",
      priceProposedNote: "Ett nytt pris har föreslagits. Kontrollera din e-post för att godkänna eller avslå.",
      rejectedNote: "Denna beställning har avslagits. Redigering är avstängd men du kan avboka.",
      rejectionReasonLabel: "Orsak:",
      date: "Datum",
      pickupTime: "Upphämtningstid",
      signServiceTitle: "Airport arrival pickup",
      signServiceSign: "Meet with a name sign",
      signServiceFee: "+20 PLN added to final price",
      signServiceSelf: "Find the driver myself at the parking",
      signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
      signText: "Text på skylt",
      flightNumber: "Flygnummer",
      pickupAddress: "Upphämtningsadress",
      passengers: "Antal passagerare",
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stort bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktinformation",
      fullName: "Fullständigt namn",
      phoneNumber: "Telefonnummer",
      email: "E-postadress",
      notesTitle: "Ytterligare anteckningar (valfritt)",
      saveChanges: "Spara ändringar",
      cancelEdit: "Avbryt",
      editBooking: "Redigera bokning",
      cancelBooking: "Avboka bokning",
      changesNotice: "Ändringar bekräftas via e-post. Vid brådskande ändringar, kontakta booking@taxiairportgdansk.com",
      updateRequestNote: "Din bokning har uppdaterats. Granska och bekräfta ändringarna.",
      rejectNote: "Denna bokning har avslagits. Kontakta support vid frågor.",
      cancelPromptTitle: "Avboka bokning?",
      cancelPromptBody: "Är du säker på att du vill avboka? Detta kan inte ångras.",
      confirmCancel: "Ja, avboka",
      keepBooking: "Behåll bokning",
      copyOrderLabel: "Beställning #",
      copyOrderIdLabel: "Beställnings-ID"
    },
    adminOrders: {
      title: "Adminbeställningar",
      subtitle: "Alla senaste beställningar och status.",
      loading: "Laddar beställningar...",
      missingToken: "Admin-token saknas.",
      errorLoad: "Det gick inte att ladda beställningar.",
      filters: {
        all: "All",
        active: "In progress",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      statuses: {
        pending: "Pending",
        confirmed: "Confirmed",
        price_proposed: "Price proposed",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      columns: {
        order: "Beställning",
        pickup: "Upphämtning",
        customer: "Kund",
        price: "Pris",
        status: "Status",
        open: "Öppna"
      },
      empty: "Inga beställningar hittades.",
      pendingPrice: (price) => `Väntar: ${price} PLN`,
      view: "Visa"
    },
    adminOrder: {
      title: "Adminbeställning detaljer",
      subtitle: "Hantera, bekräfta eller avslå beställningen.",
      back: "Tillbaka till alla beställningar",
      loading: "Laddar beställning...",
      missingToken: "Admin-token saknas.",
      errorLoad: "Det gick inte att ladda beställning.",
      updated: "Beställningen uppdaterad.",
      updateError: "Det gick inte att uppdatera beställningen.",
      statusUpdated: "Beställningsstatus uppdaterad.",
      updateRequestSent: "Uppdateringsförfrågan skickad till kunden.",
      updateRequestError: "Det gick inte att skicka uppdateringsförfrågan.",
      updateRequestSelect: "Välj minst ett fält att uppdatera.",
      orderLabel: "Beställning",
      idLabel: "ID",
      customerLabel: "Kund",
      pickupLabel: "Upphämtning",
      priceLabel: "Pris",
      pendingPrice: (price) => `Väntar: ${price} PLN`,
      additionalInfo: "Ytterligare info",
      passengers: "Passagerare:",
      largeLuggage: "Stort bagage:",
      pickupType: "Upphämtningstyp:",
      signService: "Upphämtningssätt:",
      signServiceSign: "Möt med namnskylt",
      signServiceSelf: "Hitta föraren själv",
      signFee: "Skyltavgift:",
      flightNumber: "Flygnummer:",
      signText: "Text på skylt:",
      route: "Rutt:",
      notes: "Anteckningar:",
      adminActions: "Adminåtgärder",
      confirmOrder: "Bekräfta beställning",
      rejectOrder: "Avslå beställning",
      proposePrice: "Föreslå nytt pris (PLN)",
      sendPrice: "Skicka prisförslag",
      rejectionReason: "Avslagsorsak (valfritt)",
      requestUpdate: "Begär kunduppdatering",
      requestUpdateBody: "Välj fält som kunden ska uppdatera. De får ett e-postmeddelande med redigeringslänk.",
      fieldPhone: "Telefonnummer",
      fieldEmail: "E-postadress",
      fieldFlight: "Flygnummer",
      requestUpdateAction: "Begär uppdatering",
      cancelConfirmedTitle: "Confirmed order cancellation",
      cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
      cancelConfirmedAction: "Cancel confirmed order",
      cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
      cancelConfirmedSuccess: "Order cancelled.",
      deleteRejectedTitle: "Delete rejected order",
      deleteRejectedBody: "Remove this rejected order permanently.",
      deleteRejectedAction: "Delete rejected order",
      deleteRejectedConfirm: "Delete this rejected order permanently?",
      deleteRejectedSuccess: "Order deleted.",
      completionTitle: "Slutförandestatus",
      markCompleted: "Markera som slutförd",
      markCompletedConfirm: "Mark this order as completed?",
      markFailed: "Markera som ej slutförd",
      markFailedConfirm: "Mark this order as not completed?"
    },
    pages: {
      gdanskTaxi: {
        title: "Gdańsk flygplats taxi",
        description: "Boka en snabb och pålitlig flygplatstaxi från Gdańsk flygplats. Fast pris åt båda håll, professionella förare och snabb bekräftelse.",
        route: "Gdańsk flygplats",
        examples: ["Gdańsk gamla stan", "Gdańsk Oliwa", "Gdańsk centralstation", "Brzeźno Beach"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Transfer från Gdańsk flygplats till Sopot",
        description: "Privat transfer mellan Gdańsk flygplats och Sopot med fast pris åt båda håll och flygspårning.",
        route: "Gdańsk flygplats ↔ Sopot",
        examples: ["Sopot Pier", "Sopot centrum", "Sopot hotell", "Sopot järnvägsstation"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Transfer från Gdańsk flygplats till Gdynia",
        description: "Bekväm transfer mellan Gdańsk flygplats och Gdynia med fast pris åt båda håll.",
        route: "Gdańsk flygplats ↔ Gdynia",
        examples: ["Gdynia centrum", "Gdynia hamn", "Gdynia hotell", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  },
  da: {
    common: {
      whatsapp: "WhatsApp",
      orderOnlineNow: "Tjek pris og book TAXI",
      orderNow: "Book nu",
      close: "Luk",
      noPrepayment: "Ingen forudbetaling",
      backToHome: "← Tilbage til forsiden",
      notFoundTitle: "Siden blev ikke fundet",
      notFoundBody: "Siden du leder efter findes ikke eller er flyttet.",
      notFoundCta: "Gå til forsiden",
      notFoundSupport: "Hvis dette er en fejl, kontakt os:",
      notFoundRequested: "Anmodet URL",
      notFoundPopular: "Populære sider",
      actualBadge: "AKTUEL",
      priceFrom: "fra",
      perNight: "om natten",
      perDay: "til centrum (dag)",
      whatsappMessage: "Hej Taxi Airport Gdańsk, jeg vil gerne booke en transfer."
    },
    navbar: {
      home: "Hjem",
      fleet: "Vores flåde",
      airportTaxi: "Gdańsk lufthavn taxa",
      airportSopot: "Lufthavn ↔ Sopot",
      airportGdynia: "Lufthavn ↔ Gdynia",
      prices: "Priser",
      orderNow: "BOOK NU",
      language: "Sprog"
    },
    hero: {
      promo: {
        dayPrice: "KUN 100 PLN",
        dayLabel: "til centrum (dag)",
        nightPrice: "120 PLN",
        nightLabel: "om natten"
      },
      logoAlt: "Taxi Airport Gdańsk - Lufthavnstransfer & limousineservice",
      orderViaEmail: "Bestil via e-mail",
      headline: "Gdańsk lufthavn taxa – transfer til Gdańsk, Sopot og Gdynia",
      subheadline: "Gdansk airport taxi med faste priser, 24/7 og hurtig bekræftelse.",
      whyChoose: "Hvorfor vælge Taxi Airport Gdańsk",
      benefits: "Fordele",
      benefitsList: {
        flightTrackingTitle: "Flysporing",
        flightTrackingBody: "Vi overvåger ankomster og justerer afhentningstid automatisk.",
        meetGreetTitle: "Meet & greet",
        meetGreetBody: "Professionelle chauffører, klar kommunikation og hjælp med bagage.",
        fastConfirmationTitle: "Hurtig bekræftelse",
        fastConfirmationBody: "De fleste bookinger bekræftes inden for 5–10 minutter.",
        flexiblePaymentsTitle: "Fleksible betalinger",
        flexiblePaymentsBody: "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
        freePrebookingTitle: "Gratis forudbestilling",
        freePrebookingBody: "Afbryd når som helst gratis. Fuldt automatiseret.",
        fixedPriceTitle: "Fastprisgaranti",
        fixedPriceBody: "Fast pris begge veje. Den pris du bestiller, er den pris du betaler.",
        localExpertiseTitle: "Lokal ekspertise",
        localExpertiseBody: "Erfarne Tri-City-chauffører med de hurtigste ruter.",
        assistanceTitle: "24/7 assistance",
        assistanceBody: "Altid tilgængelig før, under og efter turen."
      },
      fleetTitle: "Vores flåde",
      fleetLabel: "Køretøjer",
      standardCarsTitle: "Standardbiler",
      standardCarsBody: "1-4 passagerer | Komfortable sedaner og SUV’er",
      busTitle: "Og flere busser",
      busBody: "5-8 passagerer | Perfekt til større grupper"
    },
    vehicle: {
      title: "Vælg dit køretøj",
      subtitle: "Vælg køretøjstype, der passer til gruppestørrelsen",
      standardTitle: "Standardbil",
      standardPassengers: "1-4 passagerer",
      standardDescription: "Perfekt til enkeltpersoner, par og små familier",
      busTitle: "BUS Service",
      busPassengers: "5-8 passagerer",
      busDescription: "Ideel til større grupper og familier med ekstra bagage",
      examplePrices: "Eksempelpriser:",
      airportGdansk: "Lufthavn ↔ Gdańsk",
      airportSopot: "Lufthavn ↔ Sopot",
      airportGdynia: "Lufthavn ↔ Gdynia",
      selectStandard: "Vælg standardbil",
      selectBus: "Vælg BUS Service"
    },
    pricing: {
      back: "Tilbage til køretøjsvalg",
      titleStandard: "Standardbil (1-4 passagerer)",
      titleBus: "BUS Service (5-8 passagerer)",
      description: "Faste priser begge veje (til og fra lufthavnen). Ingen skjulte gebyrer. Nattakst gælder 22–6 samt søndage og helligdage.",
      dayRate: "Dagpris",
      nightRate: "Natpris",
      sundayNote: "(Søndage & helligdage)",
      customRouteTitle: "Tilpasset rute",
      customRouteBody: "Har du brug for en anden destination?",
      customRoutePrice: "Faste priser",
      customRoutePriceBody: "Fleksible priser baseret på ruten",
      customRouteAutoNote: "The calculator will estimate the price after you enter the addresses.",
      requestQuote: "Book nu",
      pricesNote: "Priserne inkluderer moms. Flere destinationer efter aftale.",
      tableTitle: "Pristabel",
      tableRoute: "Rute",
      tableStandardDay: "Standard dag",
      tableStandardNight: "Standard nat",
      tableBusDay: "Bus dag",
      tableBusNight: "Bus nat",
      tariffsTitle: "Priser for tilpassede ruter",
      tariffsName: "Takst",
      tariffsRate: "Pris",
      bookingTitle: "Book transfer",
      bookingSubtitle: "Vælg køretøjstype og book turen med det samme.",
      routes: {
        airport: "Lufthavn",
        gdansk: "Gdańsk centrum",
        gdynia: "Gdynia centrum"
      }
    },
    pricingLanding: {
      title: "Priser på Gdańsk lufthavnstaxa",
      subtitle: "Fastpris på lufthavnstransfer og klar prissætning for tilpassede ruter.",
      description: "Sammenlign standard- og buspriser, og book med det samme eller få et tilbud.",
      cta: "Book transfer",
      calculatorCta: "Beregner",
      highlights: [
        {
          title: "Fastpris begge veje",
          body: "De viste lufthavnsruter har fast pris uden skjulte gebyrer."
        },
        {
          title: "Tilgængelig 24/7",
          body: "Vi er tilgængelige hver dag med hurtig bekræftelse og support."
        },
        {
          title: "Busservice til grupper",
          body: "Rummelige 5–8-personers køretøjer til familier og større grupper."
        }
      ],
      faqTitle: "Pris-FAQ",
      faq: [
        {
          question: "Er priserne faste?",
          answer: "Ja. Lufthavnsruter har fast pris begge veje. Tilpassede ruter prissættes individuelt."
        },
        {
          question: "Hvornår gælder natpris?",
          answer: "Fra 22:00 til 6:00 samt på søndage og helligdage."
        },
        {
          question: "Overvåger I flyforsinkelser?",
          answer: "Ja, vi følger ankomster og justerer afhentningstiden."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Kortbetaling efter aftale. Faktura til erhvervskunder."
        }
      ]
    },
    pricingCalculator: {
      title: "Prisberegner",
      subtitle: "Indtast afhentning og destination for et prisestimat.",
      airportLabel: "Gdańsk lufthavn",
      airportAddress: "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
      pickupCustomLabel: "Afhentning fra adresse",
      destinationCustomLabel: "Destinationsadresse",
      pickupLabel: "Afhentningssted",
      pickupPlaceholder: "f.eks. Gdańsk Airport, Słowackiego 200",
      destinationLabel: "Destination",
      destinationPlaceholder: "f.eks. Sopot, Monte Cassino 1",
      distanceLabel: "Distance",
      resultsTitle: "Estimeret pris",
      fixedAllDay: "Hele dagen",
      dayRate: "Dagpris",
      nightRate: "Natpris",
      dayRateLabel: "Dagpris",
      allDayRateLabel: "Døgnpris",
      guaranteedPriceLabel: "Garanteret pris",
      standard: "Standard",
      bus: "Bus",
      loading: "Beregner rute...",
      noResult: "Ruten kunne ikke beregnes. Prøv en mere præcis adresse.",
      longRouteTitle: "Prisoverslag for lang rute",
      taximeterLabel: "Taxameter",
      proposedLabel: "Foreslået pris",
      savingsLabel: "Besparelse",
      orderNow: "Book nu",
      note: "Priserne er faste. Du kan foreslå en anden pris i bestillingsformularen for en anden rute."
    },
    trust: {
      companyTitle: "Virksomhedsoplysninger",
      paymentTitle: "Betaling & faktura",
      comfortTitle: "Komfort & sikkerhed",
      paymentBody: "Kontant eller kort efter aftale. Faktura til erhvervskunder.",
      comfortBody: "Barnesæder efter aftale. Professionelle, licenserede chauffører og dør-til-dør-hjælp."
    },
    footer: {
      description: "Professionel lufthavnstransfer i Tri-City-området. Tilgængelig 24/7.",
      contactTitle: "Kontakt",
      location: "Gdańsk, Polen",
      bookingNote: "Bestil online, via WhatsApp eller e-mail",
      hoursTitle: "Åbningstider",
      hoursBody: "24/7 - tilgængelig hver dag",
      hoursSub: "Lufthavnsafhentning, bytransfer og tilpassede ruter",
      routesTitle: "Populære ruter",
      rights: "Alle rettigheder forbeholdes.",
      cookiePolicy: "Cookies",
      privacyPolicy: "Privatlivspolitik"
    },
    cookieBanner: {
      title: "Cookie-indstillinger",
      body: "Vi bruger nødvendige cookies for at holde bookingprocessen sikker og pålidelig. Med dit samtykke bruger vi også marketingcookies til at måle konverteringer. Du kan ændre dit valg ved at rydde browserens lager.",
      readPolicy: "Læs politikken",
      decline: "Afvis",
      accept: "Acceptér cookies"
    },
    cookiePolicy: {
      title: "Cookiepolitik",
      updated: "Sidst opdateret: 2. januar 2026",
      intro: "Denne hjemmeside bruger cookies for at fungere pålideligt og holde din booking sikker. Med dit samtykke bruger vi også marketingcookies til at måle konverteringer.",
      sectionCookies: "Hvilke cookies vi bruger",
      cookiesList: [
        "Nødvendige cookies for sikkerhed og misbrugsforebyggelse.",
        "Præferencecookies til at huske grundlæggende valg under en session.",
        "Marketingcookies til at måle konverteringer fra annoncer (Google Ads)."
      ],
      sectionManage: "Sådan kan du administrere cookies",
      manageBody1: "Du kan til enhver tid slette cookies i browserens indstillinger. Blokering af nødvendige cookies kan forhindre bookingformularen i at fungere.",
      manageBody2: "Du kan også ændre dit valg for marketingcookies ved at rydde browserens lager og besøge siden igen.",
      contact: "Kontakt",
      contactBody: "Hvis du har spørgsmål om denne politik, kontakt os på"
    },
    privacyPolicy: {
      title: "Privatlivspolitik",
      updated: "Sidst opdateret: 2. januar 2026",
      intro: "Denne privatlivspolitik forklarer, hvordan Taxi Airport Gdańsk indsamler og behandler personoplysninger, når du bruger vores tjenester.",
      controllerTitle: "Dataansvarlig",
      controllerBody: "Taxi Airport Gdańsk\nGdańsk, Polen\nE-mail:",
      dataTitle: "Hvilke data vi indsamler",
      dataList: [
        "Kontaktoplysninger som navn, e-mailadresse og telefonnummer.",
        "Bookingoplysninger som afhentningssted, dato, tid, flynummer og noter.",
        "Tekniske data som IP-adresse og grundlæggende browseroplysninger for sikkerhed."
      ],
      whyTitle: "Hvorfor vi behandler dine data",
      whyList: [
        "For at besvare din booking og levere tjenesten.",
        "For at kommunikere om bookinger, ændringer eller aflysninger.",
        "For at opfylde juridiske forpligtelser og forebygge misbrug."
      ],
      legalTitle: "Retsgrundlag",
      legalList: [
        "Opfyldelse af kontrakt (GDPR art. 6(1)(b)).",
        "Juridisk forpligtelse (GDPR art. 6(1)(c)).",
        "Legitime interesser (GDPR art. 6(1)(f)), fx sikkerhed og forebyggelse af svindel."
      ],
      storageTitle: "Hvor længe vi opbevarer data",
      storageBody: "Vi opbevarer bookingdata kun så længe det er nødvendigt for at levere tjenesten og opfylde lovkrav.",
      shareTitle: "Hvem vi deler data med",
      shareBody: "Vi deler kun data med tjenesteudbydere, der er nødvendige for at levere bookingen (fx e-mailtjenester). Vi sælger ikke personoplysninger.",
      rightsTitle: "Dine rettigheder",
      rightsList: [
        "Indsigt, rettelse eller sletning af dine personoplysninger.",
        "Begrænsning eller indsigelse mod behandling.",
        "Dataportabilitet, hvor det er relevant.",
        "Ret til at klage til en tilsynsmyndighed."
      ],
      contactTitle: "Kontakt",
      contactBody: "For henvendelser om privatliv, kontakt os på"
    },
    routeLanding: {
      orderNow: "Book online nu",
      quickLinks: "Quick links",
      pricingLink: "Se priser",
      orderLinks: {
        airportGdansk: "Book airport → Gdańsk",
        airportSopot: "Book airport → Sopot",
        airportGdynia: "Book airport → Gdynia",
        custom: "Custom route"
      },
      seoParagraph: (route) => `Gdansk airport taxi for ruten ${route}. Faste priser, 24/7 service, meet & greet og hurtig bekræftelse.`,
      pricingTitle: "Eksempelpriser",
      pricingSubtitle: (route) => `Standardbil for ruten ${route}`,
      vehicleLabel: "Standardbil",
      dayLabel: "Dagpris",
      nightLabel: "Natpris",
      currency: "PLN",
      pricingNote: "Priserne inkluderer moms. Natpris gælder 22:00–06:00 samt søndage og helligdage.",
      includedTitle: "Hvad er inkluderet",
      includedList: [
        "Meet & greet i lufthavnen med klare afhentningsinstruktioner.",
        "Flysporing og fleksibel afhentningstid.",
        "Fast pris begge veje uden skjulte gebyrer.",
        "Professionelle, engelsktalende chauffører."
      ],
      destinationsTitle: "Populære destinationer",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hvor hurtigt er bekræftelsen?",
          answer: "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
        },
        {
          question: "Sporer I fly?",
          answer: "Ja, vi overvåger ankomster og justerer afhentningstiden."
        },
        {
          question: "Kan jeg afbestille?",
          answer: "Du kan afbestille via linket i din bekræftelses-e-mail."
        },
        {
          question: "Tilbyder I barnesæder?",
          answer: "Ja, barnesæder er tilgængelige efter aftale ved booking."
        },
        {
          question: "Hvordan kan jeg betale?",
          answer: "Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
        },
        {
          question: "Hvor møder jeg chaufføren?",
          answer: "Du får klare afhentningsinstruktioner og kontaktinfo i bekræftelses-e-mailen."
        }
      ]
    },
    countryLanding: {
      title: "Lufthavnstransfer Gdańsk for rejsende fra Danmark",
      description: "Privat lufthavnstransfer i Gdańsk med faste priser, afhentning 24/7 og hurtig bekræftelse.",
      intro: "Til fly fra Danmark til Gdańsk lufthavn (GDN). Book online og få hurtig bekræftelse.",
      ctaPrimary: "Book transfer",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor booke på forhånd",
      highlights: [
        "Meet & greet med klare afhentningsinstruktioner.",
        "Flysporing og fleksibel afhentningstid.",
        "Faste priser i PLN uden skjulte gebyrer.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
      ],
      airportsTitle: "Typiske afgangslufthavne (Danmark)",
      airports: [
        "København (CPH)",
        "Billund (BLL)",
        "Aarhus (AAR)"
      ],
      faqTitle: "FAQ for rejsende fra Danmark",
      faq: [
        {
          question: "Kan jeg betale i DKK?",
          answer: "Priserne er i PLN. Kortbetalinger omregnes automatisk af din bank."
        },
        {
          question: "Kan jeg få kvittering eller faktura?",
          answer: "Ja, skriv det i bookingen, så sender vi dokumentet på e-mail."
        },
        {
          question: "Sporer I fly?",
          answer: "Ja, vi overvåger ankomster og justerer afhentningstiden."
        },
        {
          question: "Hvor hurtigt får jeg bekræftelse?",
          answer: "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
        }
      ]
    },
    airportLanding: {
      title: (city, airport) => `${city} → Lufthavnstransfer Gdańsk (${airport})`,
      description: (city, airport) => `Privat transfer fra ${airport} til Gdańsk, Sopot og Gdynia. Faste priser og afhentning 24/7.`,
      intro: (city, airport) => `Direkte fly fra ${airport} til Gdańsk er sæsonbaserede. Book transfer på forhånd.`,
      ctaPrimary: "Book transfer",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor booke på forhånd",
      highlights: [
        "Meet & greet med klare afhentningsinstruktioner.",
        "Flysporing og fleksibel afhentningstid.",
        "Faste priser i PLN uden skjulte gebyrer.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
      ],
      routeTitle: (airport) => `Fra ${airport} til Gdańsk`,
      routeBody: (airport) => `Vi henter ankomster fra ${airport} og kører til Gdańsk, Sopot og Gdynia.`,
      destinationsTitle: "Populære destinationer i Tri-City",
      faqTitle: "FAQ",
      faq: [
        {
          question: "Er der direkte fly fra {city} til Gdańsk?",
          answer: "Direkte fly er sæsonbaserede. Tjek den aktuelle tidsplan før rejsen."
        },
        {
          question: "Hvordan møder jeg chaufføren?",
          answer: "Du modtager afhentningsinstruktioner og kontaktinfo i bekræftelses-e-mailen."
        },
        {
          question: "Sporer I fly?",
          answer: "Ja, vi overvåger ankomster og justerer afhentningstiden."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Ja, kortbetaling er muligt. Kontant efter aftale."
        }
      ]
    },
    cityTaxi: {
      title: "Taxi Gdańsk",
      subtitle: "Faste priser og tilgængelighed 24/7.",
      intro: "Taxi Gdańsk til lufthavnstransfer og byture. Professionelle chauffører, hurtig bekræftelse og klare priser.",
      ctaPrimary: "Book taxi",
      ctaSecondary: "Se priser",
      highlightsTitle: "Hvorfor vælge os",
      highlights: [
        "Faste priser uden skjulte gebyrer.",
        "Tilgængelig 24/7 til lufthavn og byture.",
        "Flysporing og fleksibel afhentningstid.",
        "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
      ],
      serviceAreaTitle: "Serviceområde",
      serviceArea: [
        "Gdańsk gamle by og centrum",
        "Gdańsk Wrzeszcz og Oliwa",
        "Gdańsk lufthavn (GDN)",
        "Sopot og Gdynia"
      ],
      routesTitle: "Populære taxiruter",
      routes: [
        "Gdańsk lufthavn → gamle by",
        "Gdańsk lufthavn → Sopot",
        "Gdańsk lufthavn → Gdynia",
        "Gamle by → Gdańsk lufthavn"
      ],
      cityRoutesTitle: "Taxipriser fra Gdańsk lufthavn",
      cityRoutesDescription: "Se den aktuelle pris fra Gdańsk lufthavn til disse destinationer.",
      cityRoutesItem: (destination) => `Taxipris fra Gdańsk lufthavn til ${destination}`,
      faqTitle: "FAQ",
      faq: [
        {
          question: "Hvor hurtigt er bekræftelsen?",
          answer: "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
        },
        {
          question: "Har I faste priser?",
          answer: "Ja, lufthavnsruter har faste priser i begge retninger."
        },
        {
          question: "Kan jeg betale med kort?",
          answer: "Ja, kortbetaling er muligt. Kontant efter aftale."
        },
        {
          question: "Sporer I fly?",
          answer: "Ja, vi overvåger ankomster og justerer afhentningstiden."
        }
      ]
    },
    orderForm: {
      validation: {
        phoneLetters: "Indtast venligst et gyldigt telefonnummer (kun tal).",
        phoneLength: "Indtast venligst et gyldigt telefonnummer (7–15 cifre, valgfri +).",
        email: "Indtast venligst en gyldig e-mailadresse.",
        datePast: "Vælg dagens dato eller en fremtidig dato."
      },
      rate: {
        day: "Dagpris",
        night: "Natpris",
        reasonDay: "standard dagpris",
        reasonLate: "afhentning efter 21:30 eller før 5:30",
        reasonHoliday: "søndag/helligdag",
        banner: (label, price, reason) => `Anvendt ${label}: ${price} PLN (${reason}).`
      },
      submitError: "Bestillingen kunne ikke sendes. Prøv igen.",
      submitNetworkError: "Netværksfejl ved afsendelse af bestillingen. Prøv igen.",
      submittedTitle: "Bestilling modtaget",
      submittedBody: "Tak! Din anmodning er i kø. Vent på bekræftelse – normalt 5–10 minutter. Du modtager snart en bekræftelses-e-mail.",
      awaiting: "Afventer bekræftelse...",
      totalPrice: "Samlet pris:",
      orderNumber: "Bestilling #:",
      orderId: "Bestillings-ID:",
      manageLink: "Administrer eller rediger din bestilling",
      title: "Bestil transfer",
      date: "Dato",
      pickupTime: "Afhentningstid",
      pickupType: "Afhentningstype",
      pickupTypeHint: "Vælg afhentningstype for at fortsætte.",
      airportPickup: "Afhentning i lufthavn",
      addressPickup: "Afhentning på adresse",
      signServiceTitle: "Modtagelse ved ankomst",
      signServiceSign: "Mød med navneskilt",
      signServiceFee: "+20 PLN lægges til slutprisen",
      signServiceSelf: "Jeg finder selv chaufføren på parkeringen",
      signServiceSelfNote: "Chaufføren kontakter dig via WhatsApp eller telefon, og I mødes.",
      signText: "Tekst på skilt",
      signPlaceholder: "Tekst til afhentningsskilt",
      signHelp: "Chaufføren venter med et skilt, indtil du forlader ankomsthallen",
      signPreview: "Skiltforhåndsvisning:",
      signEmpty: "Dit navn vises her",
      flightNumber: "Flynummer",
      flightPlaceholder: "f.eks. LO123",
      pickupAddress: "Afhentningsadresse",
      pickupPlaceholder: "Indtast fuld afhentningsadresse",
      passengers: "Antal passagerer",
      passengerLabel: (count) => `${count} ${count === 1 ? "person" : "personer"}`,
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stor bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktoplysninger",
      fullName: "Fulde navn",
      namePlaceholder: "Dit navn",
      phoneNumber: "Telefonnummer",
      email: "E-mailadresse",
      emailPlaceholder: "din@email.com",
      emailHelp: "Du modtager en bekræftelses-e-mail med link til redigering eller afbestilling",
      notesTitle: "Ekstra noter (valgfrit)",
      notesPlaceholder: "Særlige ønsker eller yderligere information...",
      notesHelp: "Fx barnesæde, ventetid, særlige instruktioner",
      submitting: "Sender...",
      formIncomplete: "Udfyld formularen for at fortsætte",
      missingFields: (fields) => `Udfyld venligst: ${fields}.`,
      reassurance: "Ingen forudbetaling. Gratis afbestilling. Bekræftelse på 5–10 min.",
      confirmOrder: (price) => `Bekræft bestilling - ${price} PLN`
    },
    quoteForm: {
      validation: {
        phoneLetters: "Indtast venligst et gyldigt telefonnummer (kun tal).",
        phoneLength: "Indtast venligst et gyldigt telefonnummer (7–15 cifre, valgfri +).",
        email: "Indtast venligst en gyldig e-mailadresse.",
        datePast: "Vælg dagens dato eller en fremtidig dato."
      },
      submitError: "Kunne ikke sende tilbudsanmodning. Prøv igen.",
      submitNetworkError: "Netværksfejl ved afsendelse af tilbudsanmodning. Prøv igen.",
      submittedTitle: "Tilbudsanmodning modtaget!",
      submittedBody: "Tak. Du får en e-mail inden for 5-10 minutter om tilbuddet er accepteret eller afvist.",
      manageLink: "Administrer din bestilling",
      title: "Anmod om et tilpasset tilbud",
      subtitle: "Foreslå din pris og få svar inden for 5-10 minutter",
      requestButton: "Anmod om tilbud",
      requestAnother: "Anmod om et nyt tilbud",
      toggleDescription: "Angiv dine rejsedetaljer og foreslå din pris. Du får svar inden for 5-10 minutter.",
      pickupType: "Afhentningstype",
      airportPickup: "Afhentning i lufthavn",
      addressPickup: "Afhentning på adresse",
      lockMessage: "Vælg afhentningstype for at låse resten af formularen op.",
      pickupAddress: "Afhentningsadresse",
      pickupPlaceholder: "Indtast afhentningsadresse (fx Gdańsk Airport, ul. Słowackiego 200)",
      pickupAutoNote: "Afhentningsadresse i lufthavn udfyldes automatisk",
      destinationAddress: "Destinationsadresse",
      destinationPlaceholder: "Indtast destinationsadresse (fx Gdańsk Centrum, ul. Długa 1)",
      price: "Pris",
      proposedPriceLabel: "Dit foreslåede beløb (PLN)",
      taximeterTitle: "Enter the address to see the price. If it doesn't fit, propose your own.",
      tariff1: "Takst 1 (by, 6–22): 3.90 PLN/km.",
      tariff2: "Takst 2 (by, 22–6): 5.85 PLN/km.",
      tariff3: "Takst 3 (udenfor by, 6–22): 7.80 PLN/km.",
      tariff4: "Takst 4 (udenfor by, 22–6): 11.70 PLN/km.",
      autoPriceNote: "The calculator will estimate the price after you enter the addresses.",
      fixedPriceHint: "Hvis du vil foreslå en fast pris, klik her og udfyld feltet.",
      pricePlaceholder: "Indtast dit tilbud i PLN (fx 150)",
      priceHelp: "Foreslå din pris. Vi vurderer og svarer inden for 5-10 minutter.",
      fixedRouteChecking: "Checking if this route qualifies for a fixed price...",
      fixedRouteTitle: "Fixed price available",
      fixedRouteBody: (route, price) => `${route} - fixed price ${price} PLN.`,
      fixedRouteCta: "Book fixed price",
      fixedRouteHint: "Use the fixed-price booking for the fastest confirmation.",
      fixedRouteDistance: (distance) => `Route distance: ${distance} km`,
      fixedRouteAllDay: "All-day rate applies",
      fixedRouteDay: "Day rate applies",
      fixedRouteNight: "Night rate applies",
      fixedRouteLocked: "This route qualifies for a fixed price. Please book via the fixed-price form.",
      fixedRouteComputed: (price) => `Fixed price calculated: ${price} PLN`,
      fixedRouteFooter: (price) => `Book transfer - ${price} PLN`,
      longRouteTitle: "Long route estimate",
      longRouteDistance: (distance) => `Distance: ${distance} km`,
      longRouteTaximeter: (price, rate) => `Standard estimate: ${price} PLN (${rate} PLN/km)`,
      longRouteProposed: (price) => `Our suggested price: ${price} PLN`,
      longRouteSavings: (percent) => `This is about ${percent}% less than the standard estimate`,
      longRouteNote: "You can still enter your own price below.",
      date: "Dato",
      pickupTime: "Afhentningstid",
      signServiceTitle: "Modtagelse ved ankomst",
      signServiceSign: "Mød med navneskilt",
      signServiceFee: "+20 PLN lægges til slutprisen",
      signServiceSelf: "Jeg finder selv chaufføren på parkeringen",
      signServiceSelfNote: "Chaufføren kontakter dig via WhatsApp eller telefon, og I mødes.",
      signText: "Tekst på skilt",
      signPlaceholder: "Tekst der vises på skiltet",
      signHelp: "Chaufføren venter med et skilt, indtil du forlader ankomsthallen",
      signPreview: "Skiltforhåndsvisning:",
      signEmpty: "Dit navn vises her",
      flightNumber: "Flynummer",
      flightPlaceholder: "f.eks. LO123",
      passengers: "Antal passagerer",
      passengersOptions: ["1 person", "2 personer", "3 personer", "4 personer", "5+ personer"],
      largeLuggage: "Stor bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktoplysninger",
      fullName: "Fulde navn",
      namePlaceholder: "Dit navn",
      phoneNumber: "Telefonnummer",
      email: "E-mailadresse",
      emailPlaceholder: "din@email.com",
      emailHelp: "Du får svar inden for 5-10 minutter",
      notesTitle: "Ekstra noter (valgfrit)",
      notesPlaceholder: "Særlige ønsker eller yderligere information...",
      notesHelp: "Fx barnesæde, ventetid, særlige instruktioner",
      submitting: "Sender...",
      formIncomplete: "Udfyld formularen for at fortsætte",
      missingFields: (fields) => `Udfyld venligst: ${fields}.`,
      submit: "Send tilbudsanmodning"
    },
    manageOrder: {
      errors: {
        load: "Kunne ikke indlæse bestillingen.",
        loadNetwork: "Netværksfejl ved indlæsning af bestillingen.",
        save: "Kunne ikke gemme ændringer.",
        saveNetwork: "Netværksfejl ved gemning af ændringer.",
        cancel: "Kunne ikke annullere bestillingen.",
        cancelNetwork: "Netværksfejl ved annullering.",
        copySuccess: "Kopieret til udklipsholder",
        copyFail: "Kunne ikke kopiere til udklipsholder",
        emailRequired: "Indtast din e-mailadresse."
      },
      loading: "Indlæser din bestilling...",
      accessTitle: "Få adgang til din booking",
      accessBody: "Indtast e-mailadressen brugt ved booking.",
      accessPlaceholder: "du@example.com",
      accessAction: "Fortsæt",
      accessChecking: "Tjekker...",
      cancelledTitle: "Bestilling annulleret",
      cancelledBody: "Din bestilling er annulleret. Hvis det var en fejl, opret en ny booking.",
      manageTitle: "Administrer din transfer",
      copyAction: "Kopiér",
      orderLabel: "Bestilling #",
      orderIdLabel: "Bestillings-ID",
      detailsUpdatedTitle: "Detaljer opdateret",
      detailsUpdatedBody: (date, time) => `Tak! Dine detaljer blev opdateret. Din transfer er bekræftet til ${date} kl ${time}. Vi ses.`,
      updateSubmittedTitle: "Opdatering sendt",
      updateSubmittedBody: "Din opdateringsanmodning blev sendt. Vi gennemgår den snart.",
      awaiting: "Afventer bekræftelse...",
      transferRoute: "Transferrute",
      priceLabel: "Pris:",
      pricePending: "Pris bekræftes individuelt",
      taximeterTitle: "Price calculated by taximeter",
      taximeterRates: "View taximeter rates",
      tariff1: "Tariff 1 (city, 6–22): 3.90 PLN/km.",
      tariff2: "Tariff 2 (city, 22–6): 5.85 PLN/km.",
      tariff3: "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
      tariff4: "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
      statusConfirmed: "Bekræftet",
      statusCompleted: "Afsluttet",
      statusFailed: "Ikke afsluttet",
      statusRejected: "Afvist",
      statusPriceProposed: "Pris foreslået",
      statusPending: "Afventer",
      bookingDetails: "Bookingdetaljer",
      editDetails: "Rediger detaljer",
      updateRequested: "Felter der skal opdateres",
      confirmedEditNote: "Redigering af en bekræftet booking sender den til ny godkendelse.",
      updateFieldsNote: "Opdater de markerede felter og gem ændringerne.",
      confirmedNote: "Denne booking er bekræftet.",
      completedNote: "Denne booking er markeret som afsluttet.",
      failedNote: "Denne booking er markeret som ikke afsluttet.",
      priceProposedNote: "En ny pris er foreslået. Tjek din e-mail for at acceptere eller afvise.",
      rejectedNote: "Denne booking er afvist. Redigering er deaktiveret, men du kan stadig annullere.",
      rejectionReasonLabel: "Årsag:",
      date: "Dato",
      pickupTime: "Afhentningstid",
      signServiceTitle: "Airport arrival pickup",
      signServiceSign: "Meet with a name sign",
      signServiceFee: "+20 PLN added to final price",
      signServiceSelf: "Find the driver myself at the parking",
      signServiceSelfNote: "The driver will contact you on WhatsApp or by phone and you'll meet up.",
      signText: "Tekst på skilt",
      flightNumber: "Flynummer",
      pickupAddress: "Afhentningsadresse",
      passengers: "Antal passagerer",
      passengersBus: ["5 personer", "6 personer", "7 personer", "8 personer"],
      passengersStandard: ["1 person", "2 personer", "3 personer", "4 personer"],
      largeLuggage: "Stor bagage",
      luggageNo: "Nej",
      luggageYes: "Ja",
      contactTitle: "Kontaktoplysninger",
      fullName: "Fulde navn",
      phoneNumber: "Telefonnummer",
      email: "E-mailadresse",
      notesTitle: "Ekstra noter (valgfrit)",
      saveChanges: "Gem ændringer",
      cancelEdit: "Annuller",
      editBooking: "Rediger booking",
      cancelBooking: "Annuller booking",
      changesNotice: "Ændringer bekræftes via e-mail. Kontakt booking@taxiairportgdansk.com ved hasteændringer.",
      updateRequestNote: "Din booking er opdateret. Gennemgå og bekræft ændringerne.",
      rejectNote: "Denne booking er afvist. Kontakt support hvis du har spørgsmål.",
      cancelPromptTitle: "Annuller booking?",
      cancelPromptBody: "Er du sikker på, at du vil annullere? Dette kan ikke fortrydes.",
      confirmCancel: "Ja, annuller",
      keepBooking: "Behold booking",
      copyOrderLabel: "Bestilling #",
      copyOrderIdLabel: "Bestillings-ID"
    },
    adminOrders: {
      title: "Admin-bestillinger",
      subtitle: "Alle seneste bestillinger og status.",
      loading: "Indlæser bestillinger...",
      missingToken: "Admin-token mangler.",
      errorLoad: "Kunne ikke indlæse bestillinger.",
      filters: {
        all: "All",
        active: "In progress",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      statuses: {
        pending: "Pending",
        confirmed: "Confirmed",
        price_proposed: "Price proposed",
        completed: "Completed",
        failed: "Not completed",
        rejected: "Rejected"
      },
      columns: {
        order: "Bestilling",
        pickup: "Afhentning",
        customer: "Kunde",
        price: "Pris",
        status: "Status",
        open: "Åbn"
      },
      empty: "Ingen bestillinger fundet.",
      pendingPrice: (price) => `Afventer: ${price} PLN`,
      view: "Vis"
    },
    adminOrder: {
      title: "Admin-bestillingsdetaljer",
      subtitle: "Administrer, bekræft eller afvis denne bestilling.",
      back: "Tilbage til alle bestillinger",
      loading: "Indlæser bestilling...",
      missingToken: "Admin-token mangler.",
      errorLoad: "Kunne ikke indlæse bestilling.",
      updated: "Bestilling opdateret.",
      updateError: "Kunne ikke opdatere bestilling.",
      statusUpdated: "Bestillingsstatus opdateret.",
      updateRequestSent: "Opdateringsanmodning sendt til kunden.",
      updateRequestError: "Kunne ikke sende opdateringsanmodning.",
      updateRequestSelect: "Vælg mindst ét felt til opdatering.",
      orderLabel: "Bestilling",
      idLabel: "ID",
      customerLabel: "Kunde",
      pickupLabel: "Afhentning",
      priceLabel: "Pris",
      pendingPrice: (price) => `Afventer: ${price} PLN`,
      additionalInfo: "Yderligere info",
      passengers: "Passagerer:",
      largeLuggage: "Stor bagage:",
      pickupType: "Afhentningstype:",
      signService: "Afhentningsvalg:",
      signServiceSign: "Mød med navneskilt",
      signServiceSelf: "Find chaufføren selv",
      signFee: "Skiltgebyr:",
      flightNumber: "Flynummer:",
      signText: "Tekst på skilt:",
      route: "Rute:",
      notes: "Noter:",
      adminActions: "Admin-handlinger",
      confirmOrder: "Bekræft bestilling",
      rejectOrder: "Afvis bestilling",
      proposePrice: "Foreslå ny pris (PLN)",
      sendPrice: "Send prisforslag",
      rejectionReason: "Afvisningsårsag (valgfri)",
      requestUpdate: "Anmod om opdatering fra kunden",
      requestUpdateBody: "Vælg felter kunden skal opdatere. De får en e-mail med redigeringslink.",
      fieldPhone: "Telefonnummer",
      fieldEmail: "E-mailadresse",
      fieldFlight: "Flynummer",
      requestUpdateAction: "Anmod om opdatering",
      cancelConfirmedTitle: "Confirmed order cancellation",
      cancelConfirmedBody: "Send a cancellation email due to lack of taxi availability at the requested time.",
      cancelConfirmedAction: "Cancel confirmed order",
      cancelConfirmedConfirm: "Cancel this confirmed order and notify the customer?",
      cancelConfirmedSuccess: "Order cancelled.",
      deleteRejectedTitle: "Delete rejected order",
      deleteRejectedBody: "Remove this rejected order permanently.",
      deleteRejectedAction: "Delete rejected order",
      deleteRejectedConfirm: "Delete this rejected order permanently?",
      deleteRejectedSuccess: "Order deleted.",
      completionTitle: "Status for gennemførelse",
      markCompleted: "Markér som afsluttet",
      markCompletedConfirm: "Mark this order as completed?",
      markFailed: "Markér som ikke afsluttet",
      markFailedConfirm: "Mark this order as not completed?"
    },
    pages: {
      gdanskTaxi: {
        title: "Gdańsk lufthavn taxa",
        description: "Book en hurtig og pålidelig lufthavnstaxa fra Gdańsk lufthavn. Fast pris begge veje, professionelle chauffører og hurtig bekræftelse.",
        route: "Gdańsk lufthavn",
        examples: ["Gdańsk gamle by", "Gdańsk Oliwa", "Gdańsk hovedbanegård", "Brzeźno Beach"],
        priceDay: 100,
        priceNight: 120
      },
      gdanskSopot: {
        title: "Transfer fra Gdańsk lufthavn til Sopot",
        description: "Privat transfer mellem Gdańsk lufthavn og Sopot med fast pris begge veje og flysporing.",
        route: "Gdańsk lufthavn ↔ Sopot",
        examples: ["Sopot Pier", "Sopot centrum", "Sopot hoteller", "Sopot banegård"],
        priceDay: 120,
        priceNight: 150
      },
      gdanskGdynia: {
        title: "Transfer fra Gdańsk lufthavn til Gdynia",
        description: "Komfortabel transfer mellem Gdańsk lufthavn og Gdynia med fast pris begge veje.",
        route: "Gdańsk lufthavn ↔ Gdynia",
        examples: ["Gdynia centrum", "Gdynia havn", "Gdynia hoteller", "Gdynia Orłowo"],
        priceDay: 200,
        priceNight: 250
      }
    }
  }
};
const I18nContext = createContext(null);
const getLocaleFromPathname = (pathname) => {
  if (pathname.startsWith("/pl")) return "pl";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/de")) return "de";
  if (pathname.startsWith("/fi")) return "fi";
  if (pathname.startsWith("/no")) return "no";
  if (pathname.startsWith("/sv")) return "sv";
  if (pathname.startsWith("/da")) return "da";
  return null;
};
const detectLocale = () => {
  if (typeof window === "undefined") {
    return "en";
  }
  const pathname = window.location.pathname;
  const fromPath = getLocaleFromPathname(pathname);
  if (fromPath) {
    return fromPath;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY$2);
  if (stored === "pl" || stored === "en" || stored === "de" || stored === "fi" || stored === "no" || stored === "sv" || stored === "da") {
    return stored;
  }
  const languages = navigator.languages ?? [navigator.language];
  const normalized = languages.map((lang) => lang?.toLowerCase() ?? "");
  if (normalized.some((lang) => lang.startsWith("pl"))) return "pl";
  if (normalized.some((lang) => lang.startsWith("de"))) return "de";
  if (normalized.some((lang) => lang.startsWith("fi"))) return "fi";
  if (normalized.some((lang) => lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn"))) return "no";
  if (normalized.some((lang) => lang.startsWith("sv"))) return "sv";
  if (normalized.some((lang) => lang.startsWith("da"))) return "da";
  return "en";
};
function I18nProvider({ children, initialLocale }) {
  const [locale, setLocale] = useState(initialLocale ?? detectLocale);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY$2, locale);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations[locale]
  }), [locale]);
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

const routeSlugs = {
  en: {
    airportTaxi: "gdansk-airport-taxi",
    airportSopot: "gdansk-airport-to-sopot",
    airportGdynia: "gdansk-airport-to-gdynia",
    countryLanding: "gdansk-airport-transfer-uk",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "book-gdansk-airport-transfer",
    orderAirportSopot: "book-gdansk-airport-sopot",
    orderAirportGdynia: "book-gdansk-airport-gdynia",
    orderCustom: "book-custom-transfer",
    pricing: "pricing",
    cookies: "cookies",
    privacy: "privacy"
  },
  pl: {
    airportTaxi: "taxi-lotnisko-gdansk",
    airportSopot: "lotnisko-gdansk-sopot",
    airportGdynia: "lotnisko-gdansk-gdynia",
    countryLanding: "transfer-lotnisko-gdansk",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "rezerwacja-lotnisko-gdansk",
    orderAirportSopot: "rezerwacja-lotnisko-gdansk-sopot",
    orderAirportGdynia: "rezerwacja-lotnisko-gdansk-gdynia",
    orderCustom: "rezerwacja-niestandardowa",
    pricing: "cennik",
    cookies: "polityka-cookies",
    privacy: "polityka-prywatnosci"
  },
  de: {
    airportTaxi: "gdansk-flughafen-taxi",
    airportSopot: "gdansk-flughafen-sopot",
    airportGdynia: "gdansk-flughafen-gdynia",
    countryLanding: "gdansk-airport-transfer-deutschland",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "buchung-gdansk-flughafen",
    orderAirportSopot: "buchung-gdansk-flughafen-sopot",
    orderAirportGdynia: "buchung-gdansk-flughafen-gdynia",
    orderCustom: "buchung-individuell",
    pricing: "preise",
    cookies: "cookie-richtlinie",
    privacy: "datenschutz"
  },
  fi: {
    airportTaxi: "gdansk-lentokentta-taksi",
    airportSopot: "gdansk-lentokentta-sopot",
    airportGdynia: "gdansk-lentokentta-gdynia",
    countryLanding: "gdansk-lentokenttakuljetus-suomi",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "varaus-gdansk-lentokentta",
    orderAirportSopot: "varaus-gdansk-lentokentta-sopot",
    orderAirportGdynia: "varaus-gdansk-lentokentta-gdynia",
    orderCustom: "varaus-mukautettu",
    pricing: "hinnasto",
    cookies: "evasteet",
    privacy: "tietosuoja"
  },
  no: {
    airportTaxi: "gdansk-flyplass-taxi",
    airportSopot: "gdansk-flyplass-sopot",
    airportGdynia: "gdansk-flyplass-gdynia",
    countryLanding: "gdansk-flyplasstransport-norge",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "bestilling-gdansk-flyplass",
    orderAirportSopot: "bestilling-gdansk-flyplass-sopot",
    orderAirportGdynia: "bestilling-gdansk-flyplass-gdynia",
    orderCustom: "bestilling-tilpasset",
    pricing: "priser",
    cookies: "informasjonskapsler",
    privacy: "personvern"
  },
  sv: {
    airportTaxi: "gdansk-flygplats-taxi",
    airportSopot: "gdansk-flygplats-sopot",
    airportGdynia: "gdansk-flygplats-gdynia",
    countryLanding: "gdansk-flygplatstransfer-sverige",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "bokning-gdansk-flygplats",
    orderAirportSopot: "bokning-gdansk-flygplats-sopot",
    orderAirportGdynia: "bokning-gdansk-flygplats-gdynia",
    orderCustom: "bokning-anpassad",
    pricing: "priser",
    cookies: "kakor",
    privacy: "integritetspolicy"
  },
  da: {
    airportTaxi: "gdansk-lufthavn-taxa",
    airportSopot: "gdansk-lufthavn-sopot",
    airportGdynia: "gdansk-lufthavn-gdynia",
    countryLanding: "gdansk-lufthavn-transfer-danmark",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "booking-gdansk-lufthavn",
    orderAirportSopot: "booking-gdansk-lufthavn-sopot",
    orderAirportGdynia: "booking-gdansk-lufthavn-gdynia",
    orderCustom: "booking-tilpasset",
    pricing: "priser",
    cookies: "cookiepolitik",
    privacy: "privatlivspolitik"
  }
};
const getRouteSlug = (locale, key) => routeSlugs[locale][key];
const getRoutePath = (locale, key) => {
  const basePath = localeToPath(locale);
  return `${basePath}/${getRouteSlug(locale, key)}`;
};
const getRouteKeyFromSlug = (locale, slug) => {
  const entries = Object.entries(routeSlugs[locale]);
  const match = entries.find(([, value]) => value === slug);
  return match ? match[0] : null;
};

const SCROLL_TARGET_KEY = "scroll-target";
const requestScrollTo = (targetId) => {
  if (typeof window === "undefined") {
    return false;
  }
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  window.sessionStorage.setItem(SCROLL_TARGET_KEY, targetId);
  return false;
};
const consumeScrollTarget = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const target = window.sessionStorage.getItem(SCROLL_TARGET_KEY);
  if (target) {
    window.sessionStorage.removeItem(SCROLL_TARGET_KEY);
  }
  return target;
};
const scrollToId = (targetId) => {
  if (typeof window === "undefined") {
    return false;
  }
  const element = document.getElementById(targetId);
  if (!element) {
    return false;
  }
  element.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
};

const PROD_HOSTS = /* @__PURE__ */ new Set([
  "taxiairportgdansk.com",
  "www.taxiairportgdansk.com"
]);
const isAnalyticsEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return PROD_HOSTS.has(window.location.hostname);
};

const trackContactClick = (type) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", "click", {
      event_category: "contact",
      event_label: type
    });
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "contact_click",
      contact_type: type
    });
  }
};
const trackEvent = (name, payload) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", name, payload);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: name,
      ...payload
    });
  }
};
const trackPageView = (path, title) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  trackEvent("page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href
  });
};
const trackNavClick = (label) => {
  trackEvent("nav_click", {
    event_category: "navigation",
    event_label: label
  });
};
const trackLocaleChange = (from, to) => {
  trackEvent("locale_change", {
    event_category: "navigation",
    from_locale: from,
    to_locale: to
  });
};
const trackVehicleSelect = (type) => {
  trackEvent("vehicle_select", {
    event_category: "vehicle",
    event_label: type
  });
};
const trackPricingRouteSelect = (routeKey, vehicleType) => {
  trackEvent("pricing_route_select", {
    event_category: "pricing",
    event_label: routeKey,
    vehicle_type: vehicleType
  });
};
const trackPricingAction = (action, vehicleType) => {
  trackEvent("pricing_action", {
    event_category: "pricing",
    event_label: action,
    ...vehicleType ? { vehicle_type: vehicleType } : {}
  });
};
const trackCtaClick = (label) => {
  trackEvent("cta_click", {
    event_category: "cta",
    event_label: label
  });
};
const trackFormOpen = (form) => {
  trackEvent("form_open", {
    event_category: "form",
    event_label: form
  });
};
const trackFormStart = (form) => {
  trackEvent("form_start", {
    event_category: "form",
    event_label: form
  });
};
const trackFormSubmit = (form, status, errorType) => {
  trackEvent("form_submit", {
    event_category: "form",
    event_label: form,
    status,
    ...errorType ? { error_type: errorType } : {}
  });
};
const trackFormValidation = (form, errorCount, firstField) => {
  trackEvent("form_validation_error", {
    event_category: "form",
    event_label: form,
    error_count: errorCount,
    ...firstField ? { first_field: firstField } : {}
  });
};
const trackFormClose = (form) => {
  trackEvent("form_close", {
    event_category: "form",
    event_label: form
  });
};
const trackSectionView = (section) => {
  trackEvent("section_view", {
    event_category: "navigation",
    event_label: section
  });
};

const favicon = "/favicon.svg";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  const handleLocaleChange = (nextLocale) => {
    trackLocaleChange(locale, nextLocale);
    setLocale(nextLocale);
    const nextBasePath = localeToPath(nextLocale);
    const strippedPath = location.pathname.replace(/^\/(en|pl|de|fi|no|sv|da)/, "");
    const pathWithoutLeading = strippedPath.replace(/^\//, "");
    const [firstSegment, ...restSegments] = pathWithoutLeading.split("/").filter(Boolean);
    const routeKey = firstSegment ? getRouteKeyFromSlug(locale, firstSegment) : null;
    const nextSlug = routeKey ? getRouteSlug(nextLocale, routeKey) : "";
    const nextPath = nextSlug !== "" ? `/${[nextSlug, ...restSegments].filter(Boolean).join("/")}` : strippedPath;
    const searchHash = `${location.search}${location.hash}`;
    const targetPath = nextPath && nextPath !== "/" ? `${nextBasePath}${nextPath}${searchHash}` : `${localeToRootPath(nextLocale)}${searchHash}`;
    navigate(targetPath);
    setIsMenuOpen(false);
  };
  const handleNavClick = (event, sectionId, label) => {
    event.preventDefault();
    trackNavClick(label);
    const strippedPath = location.pathname.replace(/^\/(en|pl|de|fi|no|sv|da)/, "");
    const pathWithoutLeading = strippedPath.replace(/^\//, "");
    const [firstSegment] = pathWithoutLeading.split("/").filter(Boolean);
    const currentRouteKey = firstSegment ? getRouteKeyFromSlug(locale, firstSegment) : null;
    const targetId = sectionId === "vehicle-selection" && currentRouteKey === "pricing" ? "pricing-booking" : sectionId;
    const scrolled = requestScrollTo(targetId);
    if (!scrolled) {
      if (targetId === "pricing-booking") {
        setIsMenuOpen(false);
        return;
      }
      navigate(`${basePath}/`);
    }
    setIsMenuOpen(false);
  };
  return /* @__PURE__ */ jsx("nav", { className: "sticky top-0 z-50 bg-white shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleNavClick(event, "hero", "logo"),
          className: "flex items-center gap-3",
          children: [
            /* @__PURE__ */ jsx("img", { src: favicon, alt: "Taxi Airport Gdansk logo", className: "h-8 w-8 rounded-md" }),
            /* @__PURE__ */ jsxs("span", { className: "leading-tight text-sm font-semibold text-gray-900", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-base tracking-wide", children: "Taxi Airport" }),
              /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-blue-700", children: "Gdańsk" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex flex-1 flex-nowrap items-center justify-center gap-4 lg:gap-6 text-[11px] lg:text-[13px] xl:text-sm min-w-0 tracking-tight", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: () => trackNavClick("home"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.home
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => handleNavClick(event, "fleet", "fleet"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.fleet
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportTaxi"),
            onClick: () => trackNavClick("airport_taxi"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportTaxi
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportSopot"),
            onClick: () => trackNavClick("airport_sopot"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportSopot
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportGdynia"),
            onClick: () => trackNavClick("airport_gdynia"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportGdynia
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "pricing"),
            onClick: () => trackNavClick("pricing"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.prices
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "language-select", children: t.navbar.language }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "language-select",
              value: locale,
              onChange: (event) => handleLocaleChange(event.target.value),
              className: "border border-gray-200 rounded-md px-2 py-1 text-[11px] lg:text-[13px] xl:text-sm text-gray-700 bg-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "en", children: "EN" }),
                /* @__PURE__ */ jsx("option", { value: "pl", children: "PL" }),
                /* @__PURE__ */ jsx("option", { value: "de", children: "DE" }),
                /* @__PURE__ */ jsx("option", { value: "fi", children: "FI" }),
                /* @__PURE__ */ jsx("option", { value: "no", children: "NO" }),
                /* @__PURE__ */ jsx("option", { value: "sv", children: "SV" }),
                /* @__PURE__ */ jsx("option", { value: "da", children: "DA" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => handleNavClick(event, "vehicle-selection", "order_now"),
            className: "bg-blue-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap",
            children: t.navbar.orderNow
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsMenuOpen(!isMenuOpen);
            trackNavClick(isMenuOpen ? "menu_close" : "menu_open");
          },
          "aria-label": isMenuOpen ? "Close menu" : "Open menu",
          "aria-expanded": isMenuOpen,
          "aria-controls": "mobile-nav",
          className: "md:hidden text-gray-700 hover:text-blue-600",
          children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
        }
      )
    ] }),
    isMenuOpen && /* @__PURE__ */ jsxs("div", { id: "mobile-nav", className: "md:hidden pb-4 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: () => trackNavClick("mobile_home"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.home
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleNavClick(event, "fleet", "mobile_fleet"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.fleet
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportTaxi"),
          onClick: () => trackNavClick("mobile_airport_taxi"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportTaxi
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportSopot"),
          onClick: () => trackNavClick("mobile_airport_sopot"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportSopot
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportGdynia"),
          onClick: () => trackNavClick("mobile_airport_gdynia"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportGdynia
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "pricing"),
          onClick: () => trackNavClick("mobile_pricing"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.prices
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-2 text-gray-700", children: [
        /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("label", { className: "text-sm", htmlFor: "language-select-mobile", children: t.navbar.language }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "language-select-mobile",
            value: locale,
            onChange: (event) => handleLocaleChange(event.target.value),
            className: "border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 bg-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "en", children: "EN" }),
              /* @__PURE__ */ jsx("option", { value: "pl", children: "PL" }),
              /* @__PURE__ */ jsx("option", { value: "de", children: "DE" }),
              /* @__PURE__ */ jsx("option", { value: "fi", children: "FI" }),
              /* @__PURE__ */ jsx("option", { value: "no", children: "NO" }),
              /* @__PURE__ */ jsx("option", { value: "sv", children: "SV" }),
              /* @__PURE__ */ jsx("option", { value: "da", children: "DA" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleNavClick(event, "vehicle-selection", "mobile_order_now"),
          className: "block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
          children: t.navbar.orderNow
        }
      )
    ] })
  ] }) });
}

const logo = "/assets/9bf12920b9f211a57ac7e4ff94480c867662dafa-CWhB1rIk.png";

const logoAvif = "/assets/7a4ddc58-4604-4ddd-9d85-e57bfd26feba-aQeoVn5D.avif";

const logoAvif540 = "/assets/540-CiBmXJgb.avif";

const logoAvif640 = "/assets/640-XjIpm0zk.avif";

function Hero() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;
  const heroBgUrl = "/background-960.webp";
  return /* @__PURE__ */ jsxs("div", { id: "hero", className: "relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: heroBgUrl,
        srcSet: "/background-640.webp 640w, /background-960.webp 960w, /background-1280.webp 1280w, /background-1600.webp 1600w",
        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1600px",
        alt: "Taxi Airport Gdansk hero background",
        className: "hero-bg absolute inset-0 -z-10 h-full w-full object-cover opacity-20 pointer-events-none",
        loading: "eager",
        fetchPriority: "high",
        decoding: "async",
        width: 1600,
        height: 900
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "hero-content relative max-w-6xl mx-auto px-4 py-12 sm:py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs sm:text-sm text-white shadow-sm backdrop-blur-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t.hero.promo.dayPrice }),
          /* @__PURE__ */ jsx("span", { children: t.hero.promo.dayLabel }),
          /* @__PURE__ */ jsx("span", { className: "text-white/70", children: "•" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t.hero.promo.nightPrice }),
          /* @__PURE__ */ jsx("span", { children: t.hero.promo.nightLabel })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "hero-logo flex justify-center mb-2", children: /* @__PURE__ */ jsxs("picture", { children: [
          /* @__PURE__ */ jsx(
            "source",
            {
              srcSet: `${logoAvif540} 540w, ${logoAvif640} 640w, ${logoAvif} 768w`,
              type: "image/avif",
              sizes: "(max-width: 640px) 72vw, 24rem"
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: logo,
              alt: t.hero.logoAlt,
              className: "h-auto",
              style: { width: "min(24rem, 72vw)" },
              width: 768,
              height: 768,
              decoding: "async",
              loading: "eager",
              fetchPriority: "low",
              sizes: "(max-width: 640px) 72vw, 24rem"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: whatsappLink,
              onClick: () => trackContactClick("whatsapp"),
              className: "inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors",
              children: [
                /* @__PURE__ */ jsx(MessageCircle, { className: "w-5 h-5" }),
                t.common.whatsapp
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "mailto:booking@taxiairportgdansk.com",
              onClick: () => trackContactClick("email"),
              className: "inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors",
              children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }),
                t.hero.orderViaEmail
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("hero_order_online");
                requestScrollTo("vehicle-selection");
              },
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: t.common.orderOnlineNow
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white", children: t.common.noPrepayment }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl text-blue-100 mb-3", children: t.hero.headline }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-200", children: t.hero.subheadline })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 mb-10 max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm px-6 py-6 shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 mb-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-blue-100 text-lg sm:text-xl", children: t.hero.whyChoose }),
            /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-blue-200/80", children: t.hero.benefits })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(Plane, { className: "w-8 h-8 text-orange-400 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.flightTrackingTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.flightTrackingBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(BadgeCheck, { className: "w-8 h-8 text-yellow-400 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.meetGreetTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.meetGreetBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 text-green-400 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.fastConfirmationTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.fastConfirmationBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl block text-center mb-2", children: "💳" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.flexiblePaymentsTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.flexiblePaymentsBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(CalendarCheck2, { className: "w-8 h-8 text-cyan-300 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.freePrebookingTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.freePrebookingBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(BadgeDollarSign, { className: "w-8 h-8 text-emerald-300 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.fixedPriceTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.fixedPriceBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-8 h-8 text-indigo-200 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.localExpertiseTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.localExpertiseBody })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
                children: [
                  /* @__PURE__ */ jsx(Headphones, { className: "w-8 h-8 text-rose-200 mx-auto mb-2" }),
                  /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.assistanceTitle }),
                  /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.assistanceBody })
                ]
              }
            )
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { id: "fleet", className: "mt-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-blue-800/40 to-blue-700/20 backdrop-blur-sm px-6 py-8 shadow-xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-blue-100 text-lg sm:text-xl", children: t.hero.fleetTitle }),
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-blue-200/80", children: t.hero.fleetLabel })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-gradient-to-br from-gray-100/20 to-gray-200/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all flex flex-col items-center justify-center p-8",
              children: [
                /* @__PURE__ */ jsx(Car, { className: "w-16 h-16 text-blue-100 mb-3" }),
                /* @__PURE__ */ jsx("p", { className: "text-white text-center mb-2", children: t.hero.standardCarsTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm text-center", children: t.hero.standardCarsBody })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-blue-300/30 hover:border-blue-300/50 transition-all flex flex-col items-center justify-center p-8", children: [
            /* @__PURE__ */ jsx(Bus, { className: "w-16 h-16 text-blue-200 mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-white text-center mb-2", children: t.hero.busTitle }),
            /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm text-center", children: t.hero.busBody })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

function VehicleTypeSelector({ onSelectType }) {
  const { t, locale } = useI18n();
  const sectionRef = useRef(null);
  const pricingPath = `${localeToPath(locale)}/${getRouteSlug(locale, "pricing")}#pricing-calculator`;
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const element = sectionRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "vehicle-selection", ref: sectionRef, className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-4", children: t.vehicle.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: t.vehicle.subtitle }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: pricingPath,
          className: "gemini-cta inline-flex w-full items-center justify-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-blue-800 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4" }),
            t.pricingCalculator.title
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "vehicle-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("standard"),
          className: "vehicle-card-mobile group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors", children: /* @__PURE__ */ jsx(Car, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-600" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.standardTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info space-y-3 mb-0 sm:mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.standardPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.standardDescription })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "gemini-cta py-3 px-6 rounded-lg text-center text-sm font-semibold text-blue-800 transition-colors mt-auto",
                style: { ["--cta-bg"]: "#ffffff" },
                children: t.vehicle.selectStandard
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("bus"),
          className: "vehicle-card-mobile group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors", children: /* @__PURE__ */ jsx(Users, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-700" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.busTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info space-y-3 mb-0 sm:mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.busPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.busDescription })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "gemini-cta py-3 px-6 rounded-lg text-center text-sm font-semibold text-blue-800 transition-colors mt-auto",
                style: { ["--cta-bg"]: "#ffffff" },
                children: t.vehicle.selectBus
              }
            )
          ]
        }
      )
    ] })
  ] }) });
}

const CACHE_TTL_MS = 1e3 * 60 * 60 * 6;
const STORAGE_KEY$1 = "eur-rate-cache";
let cachedRate = null;
let cachedAt = 0;
let inflight = null;
const startFetch = () => {
  if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
    return null;
  }
  if (!inflight) {
    inflight = fetchEurRate().finally(() => {
      inflight = null;
    });
  }
  return inflight;
};
const preloadEurRate = () => {
  startFetch();
};
async function fetchEurRate() {
  try {
    const response = await fetch("/api/eur-rate");
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const rate = typeof data?.rate === "number" ? data.rate : null;
    if (rate) {
      cachedRate = rate;
      cachedAt = Date.now();
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            STORAGE_KEY$1,
            JSON.stringify({ rate, at: cachedAt })
          );
        } catch {
        }
      }
    }
    return rate;
  } catch {
    return null;
  }
}
function useEurRate() {
  const [rate, setRate] = useState(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return cachedRate;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY$1);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.rate && parsed?.at && Date.now() - parsed.at < CACHE_TTL_MS) {
            cachedRate = parsed.rate;
            cachedAt = parsed.at;
            return parsed.rate;
          }
        }
      } catch {
      }
    }
    return null;
  });
  useEffect(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return;
    }
    let cancelled = false;
    const attach = (promise) => {
      promise.then((value) => {
        if (!cancelled && value) {
          setRate(value);
        }
      }).catch(() => null);
    };
    if (inflight) {
      attach(inflight);
    }
    const scheduleFetch = () => {
      const promise = startFetch();
      if (promise) {
        attach(promise);
      }
    };
    const onFirstInteraction = () => {
      scheduleFetch();
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("click", onFirstInteraction, { once: true });
      window.addEventListener("touchstart", onFirstInteraction, { passive: true, once: true });
    }
    const timeoutId = window.setTimeout(scheduleFetch, 8e3);
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.clearTimeout(timeoutId);
    };
  }, []);
  return rate;
}

function formatEur(pln, rate) {
  if (!rate || !Number.isFinite(pln)) {
    return null;
  }
  const eur = Math.round(pln * rate);
  return `~${eur}EUR`;
}

const FIXED_PRICES = {
  standard: {
    gdansk: { day: 100, night: 120 },
    sopot: { day: 120, night: 150 },
    gdynia: { day: 200, night: 250 }
  },
  bus: {
    gdansk: { day: 150, night: 180 },
    sopot: { day: 180, night: 225 },
    gdynia: { day: 300, night: 375 }
  }
};

function Pricing({
  vehicleType,
  onOrderRoute,
  onRequestQuote,
  onBack,
  showBack = true,
  variant = "flow",
  onVehicleTypeChange
}) {
  const { t } = useI18n();
  const routes = [
    {
      key: "airport_gdansk",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.standard.gdansk.day,
      priceNight: FIXED_PRICES.standard.gdansk.night,
      type: "standard"
    },
    {
      key: "airport_sopot",
      from: t.pricing.routes.airport,
      to: "Sopot",
      priceDay: FIXED_PRICES.standard.sopot.day,
      priceNight: FIXED_PRICES.standard.sopot.night,
      type: "standard"
    },
    {
      key: "airport_gdynia",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.standard.gdynia.day,
      priceNight: FIXED_PRICES.standard.gdynia.night,
      type: "standard"
    }
  ];
  const busRoutes = [
    {
      key: "airport_gdansk",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.bus.gdansk.day,
      priceNight: FIXED_PRICES.bus.gdansk.night,
      type: "bus"
    },
    {
      key: "airport_sopot",
      from: t.pricing.routes.airport,
      to: "Sopot",
      priceDay: FIXED_PRICES.bus.sopot.day,
      priceNight: FIXED_PRICES.bus.sopot.night,
      type: "bus"
    },
    {
      key: "airport_gdynia",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.bus.gdynia.day,
      priceNight: FIXED_PRICES.bus.gdynia.night,
      type: "bus"
    }
  ];
  const displayRoutes = vehicleType === "bus" ? busRoutes : routes;
  const title = vehicleType === "bus" ? t.pricing.titleBus : t.pricing.titleStandard;
  const eurRate = useEurRate();
  const eurText = (pln) => formatEur(pln, eurRate);
  useEffect(() => {
    preloadEurRate();
  }, []);
  const pricingTable = /* @__PURE__ */ jsxs("div", { className: variant === "landing" ? "rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 shadow-lg" : "", children: [
    /* @__PURE__ */ jsx("h3", { className: `text-lg font-semibold text-gray-900 ${variant === "landing" ? "text-center" : ""}`, children: t.pricing.tableTitle }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 hidden sm:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-100 text-slate-700", children: [
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-left", children: t.pricing.tableRoute }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableStandardDay }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableStandardNight }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableBusDay }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableBusNight })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: routes.map((route, index) => /* @__PURE__ */ jsxs("tr", { className: "odd:bg-white even:bg-slate-50", children: [
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3", children: [
          route.from,
          " ↔ ",
          route.to
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3 text-right", children: [
          route.priceDay,
          " PLN"
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3 text-right", children: [
          route.priceNight,
          " PLN"
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3 text-right", children: [
          busRoutes[index]?.priceDay,
          " PLN"
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3 text-right", children: [
          busRoutes[index]?.priceNight,
          " PLN"
        ] })
      ] }, `${route.to}-${index}`)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4 sm:hidden", children: routes.map((route, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-gray-900", children: [
        route.from,
        " ↔ ",
        route.to
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableStandardDay }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-gray-900", children: [
            route.priceDay,
            " PLN"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableStandardNight }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-gray-900", children: [
            route.priceNight,
            " PLN"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableBusDay }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-gray-900", children: [
            busRoutes[index]?.priceDay,
            " PLN"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableBusNight }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm font-semibold text-gray-900", children: [
            busRoutes[index]?.priceNight,
            " PLN"
          ] })
        ] })
      ] })
    ] }, `${route.to}-mobile-${index}`)) })
  ] });
  const pricingCards = /* @__PURE__ */ jsxs("div", { className: "pricing-grid-mobile grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch", children: [
    displayRoutes.map((route, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `pricing-card-mobile rounded-2xl p-6 border-2 hover:shadow-xl transition-all ${vehicleType === "bus" ? "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-300 hover:border-blue-500" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200 hover:border-blue-500"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "pricing-icon w-6 h-6 text-blue-600 flex-shrink-0 mt-1" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-900 font-semibold text-base", children: route.from }),
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-500 text-sm", children: "↕" }),
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-900 font-semibold text-base", children: route.to })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box flex items-center justify-between bg-white/90 p-4 rounded-lg border border-blue-200 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Sun, { className: "pricing-rate-icon w-5 h-5 text-yellow-500" }),
                /* @__PURE__ */ jsx("span", { className: "pricing-rate-label text-gray-800 font-medium text-sm", children: t.pricing.dayRate })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "pricing-rate-value text-blue-900 font-semibold text-sm", children: [
                  route.priceDay,
                  " PLN"
                ] }),
                eurText(route.priceDay) && /* @__PURE__ */ jsxs("div", { className: "eur-row flex items-center justify-end gap-2 text-gray-500 text-xs whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText(route.priceDay) }),
                  /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box bg-gray-900 p-4 rounded-lg border border-blue-800 shadow-sm text-white", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Moon, { className: "pricing-rate-icon w-5 h-5 text-blue-300" }),
                  /* @__PURE__ */ jsx("span", { className: "pricing-rate-label font-medium text-sm", children: t.pricing.nightRate })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("span", { className: "pricing-rate-value font-semibold text-sm", children: [
                    route.priceNight,
                    " PLN"
                  ] }),
                  eurText(route.priceNight) && /* @__PURE__ */ jsxs("div", { className: "eur-row flex items-center justify-end gap-2 text-blue-200 text-xs whitespace-nowrap", children: [
                    /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText(route.priceNight) }),
                    /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "pricing-sunday mt-2 block text-center text-blue-200 leading-none text-[10px]", children: t.pricing.sundayNote })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                trackPricingRouteSelect(route.key, vehicleType);
                onOrderRoute(route);
              },
              className: "pricing-cta w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm",
              children: t.common.orderNow
            }
          )
        ]
      },
      index
    )),
    /* @__PURE__ */ jsxs("div", { className: "pricing-card-mobile pricing-card--custom bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg h-full flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsx(Calculator, { className: "pricing-icon w-6 h-6 text-purple-600 flex-shrink-0 mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-title text-gray-900 text-base", children: t.pricing.customRouteTitle }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-body text-gray-600 text-sm mt-1", children: t.pricing.customRouteBody })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6 flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box bg-white rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-price text-gray-700 text-sm mb-2", children: t.pricing.customRoutePrice }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-note text-gray-600 text-xs", children: t.pricing.customRoutePriceBody }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-note text-gray-600 text-xs mt-2", children: t.pricing.customRouteAutoNote })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              trackPricingAction("request_quote", vehicleType);
              onRequestQuote();
            },
            className: "pricing-cta mt-auto block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm",
            children: t.pricing.requestQuote
          }
        )
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsx("section", { id: "vehicle-selection", className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    showBack && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          trackPricingAction("back", vehicleType);
          onBack();
        },
        className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors",
        children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
          t.pricing.back
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-2", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: t.pricing.description })
    ] }),
    variant === "landing" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { id: "pricing-table", className: "mt-12", children: pricingTable }),
      /* @__PURE__ */ jsxs("div", { id: "pricing-booking", className: "mt-12 text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl text-gray-900", children: t.pricing.bookingTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: t.pricing.bookingSubtitle }),
        onVehicleTypeChange && /* @__PURE__ */ jsxs("div", { className: "mt-8 inline-flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                trackVehicleSelect("standard");
                onVehicleTypeChange("standard");
              },
              className: `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vehicleType === "standard" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`,
              children: t.vehicle.standardTitle
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                trackVehicleSelect("bus");
                onVehicleTypeChange("bus");
              },
              className: `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vehicleType === "bus" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`,
              children: t.vehicle.busTitle
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-14", style: { marginTop: "3.5rem" }, children: pricingCards })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      pricingCards,
      /* @__PURE__ */ jsx("div", { className: "mt-12", children: pricingTable })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-gray-600 text-sm", children: /* @__PURE__ */ jsx("p", { children: t.pricing.pricesNote }) })
  ] }) });
}

function Footer() {
  const { t, locale } = useI18n();
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-900 text-gray-300 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white mb-4", children: "Taxi Airport Gdańsk" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: t.footer.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.contactTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:booking@taxiairportgdansk.com",
                onClick: () => trackContactClick("email"),
                className: "hover:text-white transition-colors",
                children: "booking@taxiairportgdansk.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: t.footer.location })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-4", children: t.footer.bookingNote })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.hoursTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: t.footer.hoursBody }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2", children: t.footer.hoursSub })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.routesTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "countryLanding"),
              onClick: () => trackNavClick("footer_country_landing"),
              className: "block hover:text-white transition-colors",
              children: t.countryLanding?.title ?? t.navbar.airportTaxi
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "taxiGdanskCity"),
              onClick: () => trackNavClick("footer_taxi_gdansk"),
              className: "block hover:text-white transition-colors",
              children: t.cityTaxi?.title ?? "Taxi Gdańsk"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportTaxi"),
              onClick: () => trackNavClick("footer_airport_taxi"),
              className: "block hover:text-white transition-colors",
              children: t.navbar.airportTaxi
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportSopot"),
              onClick: () => trackNavClick("footer_airport_sopot"),
              className: "block hover:text-white transition-colors",
              children: t.navbar.airportSopot
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportGdynia"),
              onClick: () => trackNavClick("footer_airport_gdynia"),
              className: "block hover:text-white transition-colors",
              children: t.navbar.airportGdynia
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-800 mt-8 pt-8 text-center text-sm", children: /* @__PURE__ */ jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Taxi Airport Gdańsk. ",
      t.footer.rights,
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "cookies"),
          onClick: () => trackNavClick("footer_cookies"),
          className: "text-gray-300 hover:text-white underline",
          children: t.footer.cookiePolicy
        }
      ),
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "|" }),
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "privacy"),
          onClick: () => trackNavClick("footer_privacy"),
          className: "text-gray-300 hover:text-white underline",
          children: t.footer.privacyPolicy
        }
      )
    ] }) })
  ] }) });
}

const STORAGE_KEY = "cookie-consent";
const getConsentStatus = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "accepted" || value === "rejected") {
    return value;
  }
  return null;
};
const setConsentStatus = (status) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, status);
};
const hasMarketingConsent = () => getConsentStatus() === "accepted";
const updateGtagConsent = (status) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag !== "function") {
    return;
  }
  if (status === "accepted") {
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted"
    });
    return;
  }
  gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied"
  });
};

function CookieBanner() {
  const { t, locale } = useI18n();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    try {
      const existing = getConsentStatus();
      if (existing) {
        updateGtagConsent(existing);
        setVisible(existing !== "accepted");
        return;
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  const accept = () => {
    setConsentStatus("accepted");
    updateGtagConsent("accepted");
    setVisible(false);
  };
  const reject = () => {
    setConsentStatus("rejected");
    updateGtagConsent("rejected");
    setVisible(false);
  };
  if (!visible || !mounted) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "px-4",
        style: { position: "fixed", left: 0, right: 0, bottom: 16, zIndex: 2147483647 },
        "data-cookie-banner": true,
        "aria-live": "polite",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "mx-auto max-w-3xl rounded-3xl text-white border border-slate-800 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
            style: { backgroundColor: "#0b0f1a" },
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold tracking-wide", children: t.cookieBanner.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-200 leading-relaxed", children: t.cookieBanner.body }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: getRoutePath(locale, "cookies"),
                    className: "inline-block text-sm text-slate-300 hover:text-white underline",
                    children: t.cookieBanner.readPolicy
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: reject,
                    className: "border border-white/25 text-white text-base font-semibold px-7 py-3 rounded-full hover:border-white/60 transition",
                    children: t.cookieBanner.decline
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: accept,
                    className: "bg-amber-400 hover:bg-amber-300 text-slate-900 text-base font-semibold px-8 py-3 rounded-full shadow-lg shadow-amber-400/35 transition",
                    children: t.cookieBanner.accept
                  }
                )
              ] })
            ] })
          }
        )
      }
    ),
    document.body
  );
}

function FloatingActions({ orderTargetId = "vehicle-selection", hide = false }) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;
  const [cookieBannerOffset, setCookieBannerOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let resizeObserver = null;
    const updateOffset = () => {
      const banner = document.querySelector("[data-cookie-banner]");
      if (!banner) {
        setCookieBannerOffset(0);
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        return;
      }
      const height = banner.getBoundingClientRect().height;
      setCookieBannerOffset(Math.ceil(height) + 12);
      if (!resizeObserver && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          const nextHeight = banner.getBoundingClientRect().height;
          setCookieBannerOffset(Math.ceil(nextHeight) + 12);
        });
        resizeObserver.observe(banner);
      }
    };
    updateOffset();
    const observer = new MutationObserver(updateOffset);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const updateVisibility = () => {
      const topVisible = window.scrollY <= 120;
      const bottomVisible = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
      setIsVisible(!topVisible && !bottomVisible);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);
  if (hide || !isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed right-6 bottom-6 z-50 hidden sm:flex flex-col gap-3",
        style: { bottom: cookieBannerOffset + 24 },
        children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: whatsappLink,
              onClick: () => trackContactClick("whatsapp"),
              className: "rounded-full px-5 py-3 text-white shadow-lg flex items-center justify-center gap-2",
              style: { backgroundColor: "#25D366" },
              children: t.common.whatsapp
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("floating_order_online");
                const scrolled = requestScrollTo(orderTargetId);
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "rounded-full px-5 py-3 text-white shadow-lg text-center",
              style: { backgroundColor: "#c2410c" },
              children: t.common.orderOnlineNow
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed left-0 right-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur",
        style: { bottom: cookieBannerOffset },
        children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: whatsappLink,
              onClick: () => trackContactClick("whatsapp"),
              className: "flex-1 rounded-full px-4 py-3 text-center text-white shadow-sm flex items-center justify-center gap-2",
              style: { backgroundColor: "#25D366" },
              children: [
                /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", className: "h-5 w-5 fill-current", children: [
                  /* @__PURE__ */ jsx("path", { d: "M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" }),
                  /* @__PURE__ */ jsx("path", { d: "M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" })
                ] }),
                t.common.whatsapp
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("sticky_order_online");
                const scrolled = requestScrollTo(orderTargetId);
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "flex-1 rounded-full px-4 py-3 text-center text-white shadow-sm",
              style: { backgroundColor: "#c2410c" },
              children: t.common.orderOnlineNow
            }
          )
        ] })
      }
    )
  ] });
}

function Breadcrumbs({ items }) {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "text-xs text-gray-500", children: /* @__PURE__ */ jsx("ol", { className: "flex flex-wrap items-center gap-2", children: items.map((item, index) => {
    const isLast = index === items.length - 1;
    return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
      item.href && !isLast ? /* @__PURE__ */ jsx("a", { href: item.href, className: "text-blue-600 hover:text-blue-700", children: item.label }) : /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: item.label }),
      !isLast && /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "/" })
    ] }, `${item.label}-${index}`);
  }) }) });
}

function CookiePolicy() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { id: "cookie-policy", className: "bg-white border-t border-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-gray-700", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl text-gray-900 mb-4", children: t.cookiePolicy.title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: t.cookiePolicy.updated }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.intro }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.sectionCookies }),
    /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 mb-6", children: t.cookiePolicy.cookiesList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.sectionManage }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.manageBody1 }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.manageBody2 }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.contact }),
    /* @__PURE__ */ jsxs("p", { children: [
      t.cookiePolicy.contactBody,
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "mailto:booking@taxiairportgdansk.com",
          onClick: () => trackContactClick("email"),
          className: "text-blue-600 hover:text-blue-700 underline",
          children: "booking@taxiairportgdansk.com"
        }
      ),
      "."
    ] })
  ] }) });
}

function PrivacyPolicy() {
  const { t } = useI18n();
  const controllerLines = t.privacyPolicy.controllerBody.split("\n");
  return /* @__PURE__ */ jsx("section", { className: "bg-white border-t border-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-gray-700 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl text-gray-900 mb-2", children: t.privacyPolicy.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: t.privacyPolicy.updated })
    ] }),
    /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.intro }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.controllerTitle }),
      /* @__PURE__ */ jsxs("p", { children: [
        controllerLines[0],
        /* @__PURE__ */ jsx("br", {}),
        controllerLines[1],
        /* @__PURE__ */ jsx("br", {}),
        controllerLines[2],
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:booking@taxiairportgdansk.com",
            onClick: () => trackContactClick("email"),
            className: "text-blue-600 hover:text-blue-700 underline",
            children: "booking@taxiairportgdansk.com"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.dataTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.dataList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.whyTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.whyList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.legalTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.legalList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.storageTitle }),
      /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.storageBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.shareTitle }),
      /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.shareBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.rightsTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.rightsList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.contactTitle }),
      /* @__PURE__ */ jsxs("p", { children: [
        t.privacyPolicy.contactBody,
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:booking@taxiairportgdansk.com",
            onClick: () => trackContactClick("email"),
            className: "text-blue-600 hover:text-blue-700 underline",
            children: "booking@taxiairportgdansk.com"
          }
        ),
        "."
      ] })
    ] })
  ] }) });
}

function CookiesPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 pt-6", children: /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: t.common.home, href: `${basePath}/` },
            { label: t.cookiePolicy.title }
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(CookiePolicy, {}),
      /* @__PURE__ */ jsx(PrivacyPolicy, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

function PrivacyPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 pt-6", children: /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: t.common.home, href: `${basePath}/` },
            { label: t.privacyPolicy.title }
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(PrivacyPolicy, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

function NotFoundPage() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const homePath = localeToRootPath(locale);
  const links = [
    { href: getRoutePath(locale, "pricing"), label: t.navbar.prices },
    { href: getRoutePath(locale, "airportTaxi"), label: t.navbar.airportTaxi },
    { href: getRoutePath(locale, "airportSopot"), label: t.navbar.airportSopot },
    { href: getRoutePath(locale, "airportGdynia"), label: t.navbar.airportGdynia },
    { href: getRoutePath(locale, "cookies"), label: t.footer.cookiePolicy },
    { href: getRoutePath(locale, "privacy"), label: t.footer.privacyPolicy }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 pb-32 sm:pb-0", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 py-16 sm:py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-orange-600", children: "404" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl text-gray-900 sm:text-4xl", children: t.common.notFoundTitle }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-gray-600", children: t.common.notFoundBody }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: t.common.notFoundSupport }),
          " ",
          /* @__PURE__ */ jsx("a", { className: "text-blue-600 hover:text-blue-700", href: "mailto:booking@taxiairportgdansk.com", children: "booking@taxiairportgdansk.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: homePath,
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: t.common.notFoundCta
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: getRoutePath(locale, "orderCustom"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: t.common.orderNow
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-gray-500", children: t.common.notFoundRequested }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 break-all text-sm text-gray-700", children: [
            location.pathname,
            location.search
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-gray-500", children: t.common.notFoundPopular }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 grid gap-2 text-sm", children: links.map((link) => /* @__PURE__ */ jsx(Link, { to: link.href, className: "text-blue-600 hover:text-blue-700", children: link.label }, link.href)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}

const countryAirportsByLocale = {
  en: {
    country: "United Kingdom",
    airports: [
      { slug: "gdansk-airport-transfer-aberdeen", city: "Aberdeen", airport: "Aberdeen (ABZ)" },
      { slug: "gdansk-airport-transfer-belfast", city: "Belfast", airport: "Belfast (BFS)" },
      { slug: "gdansk-airport-transfer-bristol", city: "Bristol", airport: "Bristol (BRS)" },
      { slug: "gdansk-airport-transfer-birmingham", city: "Birmingham", airport: "Birmingham (BHX)" },
      { slug: "gdansk-airport-transfer-edinburgh", city: "Edinburgh", airport: "Edinburgh (EDI)" },
      { slug: "gdansk-airport-transfer-leeds-bradford", city: "Leeds", airport: "Leeds Bradford (LBA)" },
      { slug: "gdansk-airport-transfer-liverpool", city: "Liverpool", airport: "Liverpool (LPL)" },
      { slug: "gdansk-airport-transfer-london-luton", city: "London", airport: "London Luton (LTN)" },
      { slug: "gdansk-airport-transfer-london-stansted", city: "London", airport: "London Stansted (STN)" },
      { slug: "gdansk-airport-transfer-manchester", city: "Manchester", airport: "Manchester (MAN)" }
    ]
  },
  de: {
    country: "Deutschland",
    airports: [
      { slug: "gdansk-flughafentransfer-dortmund", city: "Dortmund", airport: "Dortmund (DTM)" },
      { slug: "gdansk-flughafentransfer-frankfurt", city: "Frankfurt", airport: "Frankfurt (FRA)" },
      { slug: "gdansk-flughafentransfer-hamburg", city: "Hamburg", airport: "Hamburg (HAM)" },
      { slug: "gdansk-flughafentransfer-munchen", city: "München", airport: "München (MUC)" }
    ]
  },
  no: {
    country: "Norge",
    airports: [
      { slug: "gdansk-flyplasstransport-alesund", city: "Ålesund", airport: "Ålesund (AES)" },
      { slug: "gdansk-flyplasstransport-bergen", city: "Bergen", airport: "Bergen (BGO)" },
      { slug: "gdansk-flyplasstransport-haugesund", city: "Haugesund", airport: "Haugesund (HAU)" },
      { slug: "gdansk-flyplasstransport-oslo-gardermoen", city: "Oslo", airport: "Oslo Gardermoen (OSL)" },
      { slug: "gdansk-flyplasstransport-oslo-torp", city: "Oslo", airport: "Oslo Torp (TRF)" },
      { slug: "gdansk-flyplasstransport-stavanger", city: "Stavanger", airport: "Stavanger (SVG)" },
      { slug: "gdansk-flyplasstransport-tromso", city: "Tromsø", airport: "Tromsø (TOS)" },
      { slug: "gdansk-flyplasstransport-trondheim", city: "Trondheim", airport: "Trondheim (TRD)" }
    ]
  },
  sv: {
    country: "Sverige",
    airports: [
      { slug: "gdansk-flygplatstransfer-goteborg", city: "Göteborg", airport: "Göteborg (GOT)" },
      { slug: "gdansk-flygplatstransfer-malmo", city: "Malmö", airport: "Malmö (MMX)" },
      { slug: "gdansk-flygplatstransfer-skelleftea", city: "Skellefteå", airport: "Skellefteå (SFT)" },
      { slug: "gdansk-flygplatstransfer-stockholm-arlanda", city: "Stockholm", airport: "Stockholm Arlanda (ARN)" }
    ]
  },
  da: {
    country: "Danmark",
    airports: [
      { slug: "gdansk-lufthavn-transfer-aarhus", city: "Aarhus", airport: "Aarhus (AAR)" },
      { slug: "gdansk-lufthavn-transfer-billund", city: "Billund", airport: "Billund (BLL)" },
      { slug: "gdansk-lufthavn-transfer-copenhagen", city: "København", airport: "København (CPH)" }
    ]
  },
  fi: {
    country: "Suomi",
    airports: [
      { slug: "gdansk-lentokenttakuljetus-helsinki", city: "Helsinki", airport: "Helsinki (HEL)" },
      { slug: "gdansk-lentokenttakuljetus-turku", city: "Turku", airport: "Turku (TKU)" }
    ]
  }
};
const getCountryAirports = (locale) => countryAirportsByLocale[locale]?.airports ?? [];
const getCountryAirportBySlug = (locale, slug) => getCountryAirports(locale).find((airport) => airport.slug === slug) ?? null;
const getCountryAirportCountry = (locale) => countryAirportsByLocale[locale]?.country ?? "";

function CountryLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const airportPages = getCountryAirports(locale);
  const country = t.countryLanding ?? {
    title: t.routeLanding?.orderNow ?? "Airport transfer",
    description: t.routeLanding?.seoParagraph?.("Gdańsk") ?? "",
    intro: "",
    ctaPrimary: t.routeLanding?.orderNow ?? "Book",
    ctaSecondary: t.routeLanding?.pricingLink ?? "Pricing",
    highlightsTitle: t.routeLanding?.includedTitle ?? "Highlights",
    highlights: t.routeLanding?.includedList ?? [],
    airportsTitle: t.routeLanding?.destinationsTitle ?? "Popular destinations",
    airports: t.pages?.gdanskTaxi?.examples ?? [],
    faqTitle: t.routeLanding?.faqTitle ?? "FAQ",
    faq: t.routeLanding?.faq ?? []
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: country.title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: country.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: country.description }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: country.intro }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("country_landing_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: country.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("country_landing_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: country.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: country.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: country.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: country.airportsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: country.airports.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) }),
          airportPages.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 text-sm", children: airportPages.map((airport) => /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${airport.slug}`,
              onClick: () => trackNavClick("country_landing_airport_link"),
              className: "text-blue-600 hover:text-blue-700",
              children: airport.airport
            },
            airport.slug
          )) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: country.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: country.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

const replaceTokens = (text, tokens) => Object.entries(tokens).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), text);
function CountryAirportLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { airportSlug } = useParams();
  const location = useLocation();
  const slugFromPath = location.pathname.replace(/\/$/, "").split("/").pop() ?? null;
  const resolvedSlug = airportSlug ?? slugFromPath;
  const airportData = resolvedSlug ? getCountryAirportBySlug(locale, resolvedSlug) : null;
  if (!airportData) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  const country = getCountryAirportCountry(locale);
  const tokens = {
    city: airportData.city,
    airport: airportData.airport,
    country
  };
  const landing = t.airportLanding;
  const destinations = t.pages?.gdanskTaxi?.examples ?? [];
  const highlights = landing.highlights.map((item) => replaceTokens(item, tokens));
  const faq = landing.faq.map((entry) => ({
    question: replaceTokens(entry.question, tokens),
    answer: replaceTokens(entry.answer, tokens)
  }));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: landing.title(airportData.city, airportData.airport) }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: landing.title(airportData.city, airportData.airport) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: landing.description(airportData.city, airportData.airport) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: landing.intro(airportData.city, airportData.airport) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("airport_landing_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: landing.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("airport_landing_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: landing.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landing.routeTitle(airportData.airport) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: landing.routeBody(airportData.airport) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landing.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landing.destinationsTitle }),
        /* @__PURE__ */ jsx("ul", { className: "grid gap-2 text-sm text-gray-600 md:grid-cols-2", children: destinations.map((item) => /* @__PURE__ */ jsx("li", { className: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2", children: item }, item)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: landing.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

const cityRoutesByLocale = {
  pl: [
    { slug: "taxi-lotnisko-gdansk-slupsk", destination: "Słupsk" },
    { slug: "taxi-lotnisko-gdansk-malbork", destination: "Malbork" },
    { slug: "taxi-lotnisko-gdansk-olsztyn", destination: "Olsztyn" },
    { slug: "taxi-lotnisko-gdansk-starogard-gdanski", destination: "Starogard Gdański" },
    { slug: "taxi-lotnisko-gdansk-wladyslawowo", destination: "Władysławowo" },
    { slug: "taxi-lotnisko-gdansk-hel", destination: "Hel" },
    { slug: "taxi-lotnisko-gdansk-ostroda", destination: "Ostróda" },
    { slug: "taxi-lotnisko-gdansk-wejherowo", destination: "Wejherowo" },
    { slug: "taxi-lotnisko-gdansk-rumia", destination: "Rumia" },
    { slug: "taxi-lotnisko-gdansk-reda", destination: "Reda" }
  ]
};
const getCityRoutes = (locale) => cityRoutesByLocale[locale] ?? [];
const getCityRouteBySlug = (locale, slug) => getCityRoutes(locale).find((route) => route.slug === slug) ?? null;
Object.fromEntries(
  Object.entries(cityRoutesByLocale).map(([locale, routes]) => [locale, routes.map((route) => route.slug)])
);

function CityRouteLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { routeSlug } = useParams();
  const location = useLocation();
  const slugFromPath = location.pathname.replace(/\/$/, "").split("/").pop() ?? null;
  const resolvedSlug = routeSlug ?? slugFromPath;
  const route = resolvedSlug ? getCityRouteBySlug(locale, resolvedSlug) : null;
  const cityRoutes = getCityRoutes(locale).filter((entry) => entry.slug !== resolvedSlug);
  if (!route) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  const destination = route.destination;
  const cityTaxi = t.cityTaxi;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: `Taxi Gdańsk → ${destination}` }
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl text-gray-900 mb-4", children: [
          "Cena taxi z lotniska Gdańsk do ",
          destination
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-4", children: [
          "Sprawdź aktualną cenę przejazdu z lotniska Gdańsk do ",
          destination,
          ". Kalkulator pokaże cenę na dziś w kilka sekund."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-6", children: [
          "Taxi Gdańsk z lotniska do ",
          destination,
          " – stałe ceny, 24/7 i szybkie potwierdzenie."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("city_route_calculator");
                const scrolled = requestScrollTo("pricing-calculator");
                if (!scrolled) {
                  window.location.href = `${basePath}/${getRouteSlug(locale, "pricing")}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: "Sprawdź cenę w kalkulatorze"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackNavClick("city_route_booking");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: "Zarezerwuj przejazd"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: "Dlaczego warto" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: cityTaxi.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: "Obsługiwane trasy" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: cityTaxi.routes.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: cityTaxi.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: cityTaxi.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) }),
      cityRoutes.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: cityTaxi.cityRoutesTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: cityTaxi.cityRoutesDescription }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: cityRoutes.map((entry) => /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/${entry.slug}`,
            onClick: () => trackNavClick("city_routes_link"),
            className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50",
            children: cityTaxi.cityRoutesItem(entry.destination)
          },
          entry.slug
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

function TaxiGdanskPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const content = t.cityTaxi;
  const cityRoutes = getCityRoutes(locale);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: content.title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: content.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: content.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: content.intro }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("city_taxi_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow",
              children: content.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("city_taxi_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: content.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: content.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.serviceAreaTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: content.serviceArea.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.routesTitle }),
        /* @__PURE__ */ jsx("ul", { className: "grid gap-2 text-sm text-gray-600 md:grid-cols-2", children: content.routes.map((item) => /* @__PURE__ */ jsx("li", { className: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2", children: item }, item)) })
      ] }) }),
      cityRoutes.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.cityRoutesTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: content.cityRoutesDescription }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: cityRoutes.map((route) => /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/${route.slug}`,
            onClick: () => trackNavClick("city_routes_link"),
            className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50",
            children: content.cityRoutesItem(route.destination)
          },
          route.slug
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: content.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: content.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

function TrustSection() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 border-t border-slate-200 py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.companyTitle }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "WK DRIVE",
        /* @__PURE__ */ jsx("br", {}),
        "NIP: 5862330063",
        /* @__PURE__ */ jsx("br", {}),
        "Gdańsk"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.paymentTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.paymentBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.comfortTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.comfortBody })
    ] })
  ] }) }) });
}

const OrderForm = lazy(() => import('./assets/OrderForm-BKkVBRaJ.mjs').then((mod) => ({ default: mod.OrderForm })));
const QuoteForm = lazy(() => import('./assets/QuoteForm-Ds4HynrK.mjs').then(n => n.b).then((mod) => ({ default: mod.QuoteForm })));
const ManageOrder = lazy(() => import('./assets/ManageOrder-DCExnqPT.mjs').then((mod) => ({ default: mod.ManageOrder })));
const RouteLanding = lazy(() => import('./assets/RouteLanding-DtEjgJ9w.mjs').then((mod) => ({ default: mod.RouteLanding })));
const OrderRoutePage = lazy(() => import('./assets/OrderRoutePage-CXRPWaAN.mjs').then((mod) => ({ default: mod.OrderRoutePage })));
const CustomOrderPage = lazy(() => import('./assets/OrderRoutePage-CXRPWaAN.mjs').then((mod) => ({ default: mod.CustomOrderPage })));
const PricingPage = lazy(() => import('./assets/PricingPage-Y4GMkPDd.mjs').then((mod) => ({ default: mod.PricingPage })));
const AdminOrdersPage = lazy(() => import('./assets/AdminOrdersPage-KLnoh50w.mjs').then((mod) => ({ default: mod.AdminOrdersPage })));
const AdminOrderPage = lazy(() => import('./assets/AdminOrderPage-CA1d_B91.mjs').then((mod) => ({ default: mod.AdminOrderPage })));
const renderCountryAirportRoutes = (locale) => getCountryAirports(locale).map((airport) => /* @__PURE__ */ jsx(Route, { path: airport.slug, element: /* @__PURE__ */ jsx(CountryAirportLanding, {}) }, airport.slug));
const renderCityRouteRoutes = (locale) => getCityRoutes(locale).map((route) => /* @__PURE__ */ jsx(Route, { path: route.slug, element: /* @__PURE__ */ jsx(CityRouteLanding, {}) }, route.slug));
function Landing() {
  const { t } = useI18n();
  const [step, setStep] = useState("vehicle");
  const [vehicleType, setVehicleType] = useState("standard");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [pricingTracked, setPricingTracked] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  if (orderId) {
    return /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(ManageOrder, { orderId }) });
  }
  const handleVehicleSelect = (type) => {
    trackVehicleSelect(type);
    setVehicleType(type);
    setStep("pricing");
    window.requestAnimationFrame(() => {
      document.getElementById("vehicle-selection")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  };
  const handleBackToVehicleSelection = () => {
    setStep("vehicle");
  };
  const handleOrderRoute = (route) => {
    trackFormOpen("order");
    setSelectedRoute(route);
  };
  const handleRequestQuote = () => {
    trackFormOpen("quote");
    setShowQuoteForm(true);
  };
  useEffect(() => {
    const updateVisibility = () => {
      const target = document.getElementById("vehicle-selection");
      if (!target) {
        return;
      }
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const reached = window.scrollY >= targetTop - 120;
      if (reached && !pricingTracked) {
        setPricingTracked(true);
        trackSectionView("vehicle_selection");
      }
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pricingTracked]);
  useEffect(() => {
    const hash = window.location.hash;
    let targetId = "";
    if (hash) {
      targetId = hash.replace("#", "");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (!targetId) {
      targetId = consumeScrollTarget() ?? "";
    }
    if (!targetId) {
      return;
    }
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      if (scrollToId(targetId) || attempts > 10) {
        return;
      }
      window.setTimeout(tryScroll, 120);
    };
    tryScroll();
  }, [step]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 pb-32 sm:pb-0", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx("div", { className: "defer-render", children: step === "vehicle" ? /* @__PURE__ */ jsx(VehicleTypeSelector, { onSelectType: handleVehicleSelect }) : /* @__PURE__ */ jsx(
        Pricing,
        {
          vehicleType,
          onOrderRoute: handleOrderRoute,
          onRequestQuote: handleRequestQuote,
          onBack: handleBackToVehicleSelection
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "defer-render", children: /* @__PURE__ */ jsx(TrustSection, {}) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "defer-render", children: /* @__PURE__ */ jsx(Footer, {}) }),
    selectedRoute && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      OrderForm,
      {
        route: selectedRoute,
        onClose: () => setSelectedRoute(null)
      }
    ) }),
    showQuoteForm && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      QuoteForm,
      {
        onClose: () => {
          setShowQuoteForm(false);
        },
        initialVehicleType: vehicleType
      }
    ) }),
    /* @__PURE__ */ jsx(FloatingActions, { hide: Boolean(selectedRoute || showQuoteForm) })
  ] });
}
function App() {
  const { t } = useI18n();
  const location = useLocation();
  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(AutoRedirect, {}) }),
      /* @__PURE__ */ jsxs(Route, { path: "/en", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "en" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("en", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("en"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("en", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("en", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("en", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/de", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "de" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("de", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("de"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("de", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("de", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("de", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/fi", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "fi" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("fi", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("fi"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("fi", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("fi", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("fi", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/no", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "no" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("no", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("no"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("no", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("no", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("no", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/sv", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "sv" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("sv", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("sv"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("sv", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("sv", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("sv", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/da", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "da" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("da", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("da"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("da", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("da", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("da", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsxs(Route, { path: "/pl", element: /* @__PURE__ */ jsx(LocalizedShell, { locale: "pl" }), children: [
        /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
        /* @__PURE__ */ jsx(Route, { path: getRouteSlug("pl", "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
        renderCountryAirportRoutes("pl"),
        renderCityRouteRoutes("pl"),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("pl", "airportTaxi"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskTaxi.title,
                description: t.pages.gdanskTaxi.description,
                route: t.pages.gdanskTaxi.route,
                examples: t.pages.gdanskTaxi.examples,
                pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("pl", "airportSopot"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskSopot.title,
                description: t.pages.gdanskSopot.description,
                route: t.pages.gdanskSopot.route,
                examples: t.pages.gdanskSopot.examples,
                pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: getRouteSlug("pl", "airportGdynia"),
            element: /* @__PURE__ */ jsx(
              RouteLanding,
              {
                title: t.pages.gdanskGdynia.title,
                description: t.pages.gdanskGdynia.description,
                route: t.pages.gdanskGdynia.route,
                examples: t.pages.gdanskGdynia.examples,
                pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "gdansk-airport-taxi",
            element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" })
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "gdansk-airport-to-sopot",
            element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" })
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "gdansk-airport-to-gdynia",
            element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" })
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "cookies",
            element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" })
          }
        ),
        /* @__PURE__ */ jsx(
          Route,
          {
            path: "privacy",
            element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" })
          }
        ),
        /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
      ] }),
      /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "pricing" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(LegacyRedirect, { to: "admin" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin/orders/:id", element: /* @__PURE__ */ jsx(LegacyAdminOrderRedirect, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-taxi", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-to-sopot", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-to-gdynia", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/taxi-lotnisko-gdansk", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/lotnisko-gdansk-sopot", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/lotnisko-gdansk-gdynia", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/polityka-cookies", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/polityka-prywatnosci", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" }) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
    ] }) }),
    /* @__PURE__ */ jsx(CookieBanner, {})
  ] });
}
function LocalizedShell({ locale }) {
  const { setLocale } = useI18n();
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);
  return /* @__PURE__ */ jsx(Outlet, {});
}
function AutoRedirect() {
  const { locale } = useI18n();
  const location = useLocation();
  const target = `${localeToRootPath(locale)}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function LegacyRedirect({ to }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${to}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function LegacyRedirectToRoute({ routeKey }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${getRouteSlug(locale, routeKey)}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function LegacyAdminOrderRedirect() {
  const { locale } = useI18n();
  const { id } = useParams();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/admin/orders/${id ?? ""}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}

function render(url) {
  const initialLocale = getLocaleFromPathname(url) ?? "en";
  return renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(I18nProvider, { initialLocale, children: /* @__PURE__ */ jsx(App, {}) }) }) })
  );
}

export { Breadcrumbs as B, Footer as F, Navbar as N, Pricing as P, useEurRate as a, trackNavClick as b, FloatingActions as c, trackFormOpen as d, FIXED_PRICES as e, formatEur as f, getRouteSlug as g, trackFormClose as h, trackFormValidation as i, trackFormSubmit as j, trackFormStart as k, localeToPath as l, isAnalyticsEnabled as m, hasMarketingConsent as n, preloadEurRate as p, requestScrollTo as r, render, scrollToId as s, trackCtaClick as t, useI18n as u };
