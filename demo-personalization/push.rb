#! /usr/bin/env ruby

require "json"
require "algoliasearch"
require "open-uri"


####
#### LAUNCH
####
if ARGV.length != 3
  $stderr << "usage: push.rb APPLICATION_ID API_KEY INDEX\n"
  exit 1
end


####
#### LOAD DATA
####
movies = JSON.parse File.read("data.json")
settings = JSON.parse File.read("settings.json")


####
#### ALGOLIA INIT & CONFIGURATION
####
Algolia.init :application_id => ARGV[0], :api_key => ARGV[1]
index = Algolia::Index.new(ARGV[2])
index.set_settings(settings)


####
#### INDEXING
####
index.clear
movies.each_slice(10_000) do |batch|
  index.add_objects batch
end