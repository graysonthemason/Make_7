require './app'
require 'rubygems'
require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'] || "development")



run App

