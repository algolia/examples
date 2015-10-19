#! /usr/bin/env ruby

require 'json'
require 'algoliasearch'
require 'open-uri'
require 'net/http'


####
#### SCRIPT PARAMETERS
####
if ARGV.length != 3
    $stderr << "usage: import.rb APP_ID API_KEY INDEX\n"
    exit 1
end
APP_ID  = ARGV[0]
API_KEY = ARGV[1]
INDEX   = ARGV[2]

####
#### INIT ALGOLIA
####
Algolia.init :application_id => APP_ID, :api_key => API_KEY


####
#### LOAD DATA
####
airports = File.read('airports.dat').split("\n")
records = {}
airports.each do |airport|
    airport_info = airport.gsub(/\"/, '').split ","
    records["#{airport_info[0]}"] = {
        objectID:   airport_info[0],
        name:       airport_info[1],
        city:       airport_info[2],
        country:    airport_info[3],
        airport_id: airport_info[4],
        _geoloc:    { lat: airport_info[6].to_f, lng: airport_info[7].to_f },
        nb_airline_liaisons: 0
    }
end

routes = File.read('routes.dat').split("\n")
routes.each do |route|
    route_info = route.gsub(/\"/, '').split ","
    records["#{route_info[3]}"][:nb_airline_liaisons] += 1 if records["#{route_info[3]}"]
    records["#{route_info[5]}"][:nb_airline_liaisons] += 1 if records["#{route_info[5]}"]
end

records = records.values.select { |r| r[:nb_airline_liaisons] > 0 }


####
#### PUSH TO ALGOLIA
####
puts "Pushing #{records.size} records to #{INDEX}"
index = Algolia::Index.new INDEX
index.clear
index.set_settings({
    attributesToIndex: ['country', 'city', 'name', 'airport_id'],
    customRanking: ['desc(nb_airline_liaisons)'],
    removeWordsIfNoResults: "allOptional",
    typoTolerance: "min"
    })
records.each_slice(1000) do |batch|
    index.add_objects(batch)
end
puts "#{records.size} records pushed!"


