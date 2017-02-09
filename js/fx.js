(function() {

	var YQL = "https://query.yahooapis.com/v1/public/yql?q={query}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

	ROCK.ExchangeRates = ROCK.Collection.extend({
		constructor: function(baseRate) {

			this.baseRate = baseRate;

		},
		loadCount: 0,
		baseRate: null,
		toSelect: function() {
		
			var
			_return = ROCK.JQUERY.createNode("select");
			
			this.each(function(exchangeRate) {
				
				ROCK.JQUERY.createNode("option").html(exchangeRate.name + " (" + exchangeRate.id + ")").attr("value", exchangeRate.id).appendTo(_return);
				
			});
			
			return _return;
			
		},
		append: function(value) {
		
			if(this.getItemByKeyValue("id", value.id)) {
				console.log("duplicate " + value.id);
			};

			this.push(value);
			
		},
		set: function(id, name) {
		
			this.append(new ROCK.ExchangeRate(id, name, this));
			
		},
		getRates: function() {
			
			this.each(function(item) {
				item.getRate();
			});
			
		},
		getRate: function(value, from, to) {
		
			var 
			roundTo = 100,
			fromExchangeRate = this.getItemByKeyValue("id", from),
			fromExchangeRateMultiplier = fromExchangeRate.multiplier,
			fromExchangeRateMultiplierAsGBPMultiplier = (1/fromExchangeRateMultiplier),
			toExchangeRate = this.getItemByKeyValue("id", to),
			toExchangeRateMultiplier = toExchangeRate.multiplier,
			output = ROCK.MATH.roundTo(((fromExchangeRateMultiplierAsGBPMultiplier*toExchangeRateMultiplier)*value), roundTo);
			
			return output.toFixed(2);
		
		}
	});
	
	ROCK.ExchangeRate = ROCK.Object.extend({
		constructor: function(id, name, collection) {
		
			this.id = id;
			this.name = name;
			this.collection = collection;

		},
		multiplier: 1,
		getQuery: function() {
		
			return encodeURIComponent("select * from yahoo.finance.xchange where pair in (\"" + this.collection.baseRate + this.id + "\")");
			
		},
		getRate: function() {

			var 
			_this = this,
			request = new ROCK.HTTP.GET(YQL.replace("{query}", _this.getQuery()), function(response) {
				
				_this.setMultiplier(response.query.results.rate.Rate);
				_this.collection.loadCount ++;
				_this.collection.onload(_this, _this.collection.loadCount);

			});

			request.send();
			
		},
		setMultiplier: function(value) {
			
			this.multiplier = Number(value);
			return this;
			
		}
	});
	
})();