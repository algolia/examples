require 'algoliasearch'
require 'pp'

Algolia.init({ :application_id => "", :api_key => "" })
index = Algolia::Index.new("movies")
settings = index.get_settings

def watch_list(score)
  watch_list = []
  %w(user_1 user_2 user_3 user_4).each do |user|
    watch_list << user if rand(400+score) > 450
  end
  watch_list
end

records = []
actors = []
index.browse({ :hitsPerPage => 1000, :attributesToRetrieve => ["title", "image", "color", "score", "year", "actors", "genre"] }) do |hit|
  score = hit["score"] * 10 + (hit["year"] - 1951) / 6.8
  records << {
    objectID: hit["objectID"],
    title: hit["title"],
    image: hit["image"],
    color: hit["color"],
    score: score,
    actors: hit["actors"],
    genres: hit["genre"],
    watch_list: watch_list(score)
  }
  actors += hit["actors"].map { |x| { "#{x}" => score } }
  # break if records.size >= 10000
end

actors_count = actors.each_with_object(Hash.new(0)) { |word,counts| counts[word.keys.first] += 1 }
actors = actors.each_with_object(Hash.new(0)) { |word,counts| counts[word.keys.first] += word.values.first }.to_a.sort_by { |x| x.last }.reverse
actors = actors.map { |x| [x.first, x.last / actors_count[x.first] * Math.log(actors_count[x.first].to_f, 60)] }.sort_by { |x| x.last }.reverse.take(actors.size*0.6)

records.each do |record|
  record[:actors].select!.with_index { |x, i|  i <= 2 || actors.include?(x) }
end


index = Algolia::Index.new("personalization_movies")
index.clear
index.set_settings(settings.merge({
  "attributesToIndex" => ["unordered(title)", "unordered(actors)"],
  "numericAttributesToIndex" => [],
  "attributesForFaceting" => ["actors", "genres", "watch_list"],
  "customRanking" => ["desc(score)"],
  "ranking" => %w(filters typo words proximity attribute exact custom)
}))
records.each_slice(10_000) do |batch|
  index.add_objects batch
end