# encoding: utf-8
require 'pp'
require 'json'



####
#### RETRIEVE FILES
####
files = Dir.entries("../images").select {|f| !File.directory? f} - [".DS_Store"]



####
#### GENERATE DATA
####
records = []
files.each do |f|
    name, model, color = f.gsub(".png", "").split("-")
    records << {
        objectID: "#{name}-#{model}-#{color}",
        name: name,
        model: model,
        color: color,
        image_slug: f,
        number_of_likes: Random.rand(1000),
    }
end



####
#### WRITE .JSON
####
json_file = File.open("data.json","w")
json_file.write(JSON.pretty_generate records)
json_file.close