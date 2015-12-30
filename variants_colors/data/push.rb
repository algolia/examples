# encoding: utf-8

require 'pp'
require 'json'
require 'algoliasearch'


####
#### LAUNCH
####
if ARGV.length != 3
  $stderr << "usage: push.rb APPLICATION_ID ADMIN_API_KEY INDEX\n"
  exit 1
end
APP_ID     = ARGV[0]
API_KEY    = ARGV[1]
INDEX_NAME = ARGV[2]



####
#### LOAD DATA
####
products = JSON.parse File.read("data.json")



####
#### ALGOLIA INIT & CONFIGURATION
####
Algolia.init :application_id => APP_ID, :api_key => API_KEY
index = Algolia::Index.new INDEX_NAME
index.set_settings({
    attributesToIndex: ['model', 'name', 'color'],
    customRanking: ['desc(number_of_likes)'],
    attributeForDistinct: "model"
    })



####
#### INDEXING
####
index.clear
products.each_slice(1000) do |batch|
    index.add_objects batch
end

