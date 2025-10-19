# ThunderSales

ThunderSales is a web-app helping you to calculate the silver lions and golen eagles before WarThunder sales.

# API Documentation:

https://wtvehiclesapi.sgambe.serv00.net/docs/

# Toast used:

https://vue3-toastify.js-bridge.com/

# CSV Parser for localised vehicle names:

https://www.papaparse.com/

## Vehicle filtering is based on:

Turteł's awesome doc:
https://docs.google.com/document/d/18UJMjgREFIVBG0HqPckBpTzq2MvOXnN6LOsp94G1wF8/edit

## Datatable, icons and other components from PrimeVue

https://primevue.org/

## Vehicle's names are using the units.csv file

To achieve reading the latest names, I parse through the latest units.csv file. If some vehicles you see in the app are using unit codes, that means I forgot to update the units.csv.
If you want to fork this project, here's how you can get the csv yourself.

1. Open the installation folder
2. Find the config.blk file
   - Find the line "testLocalization:b=no"
   - Replace it with "testLocalization:b=yes"
3. Save and restart the client—it will take a bit longer
4. After restart, a new folder called "lang" will appear
5. Copy the units.csv file to the src/assets folder here
