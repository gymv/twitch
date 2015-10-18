var twitch = (function () {

	var baseURL = "https://api.twitch.tv/kraken";

    var MAX_ITEMS_IN_PAGE = 6;

    var currentPage = 0;

	var loadJSONP = function (url) {
		var callback = 'twitch.callback';
	    var ref = window.document.getElementsByTagName('script')[0];
	    var script = window.document.createElement('script');
	    script.src = url + (url.indexOf('?') + 1 ? '&' : '?') + 'callback=' + callback;

	    ref.parentNode.insertBefore( script, ref );

	    script.onload = function () {
	        this.remove();
	    };
	};

	var getData = function (data) {
	    console.log( data );
	    return data;
	};

    var showNavigation = function() {
        if (twitch.total>MAX_ITEMS_IN_PAGE) {
            document.getElementById("navID").innerText=currentPage+1+"/"+Math.ceil(twitch.total/MAX_ITEMS_IN_PAGE);
            document.getElementById("navBlockId").style.visibility="visible";
        } else {
            document.getElementById("navBlockId").style.visibility="hidden";
        }
    };

    var makePage = function(data) {
        twitch.currentPage = 0;
        twitch.total = (data._total !== undefined ? data._total : 0);
        document.getElementById("resultsId").innerText="Total results: " + twitch.total;
           
        var body = document.getElementsByTagName("body")[0];
        if (document.getElementsByTagName("ul").length>0) {
            body.removeChild(document.getElementsByTagName("ul")[0]);
        }                     ; 
        if (data.streams && data.streams.length > 0) {
            makeStreams(data.streams);
        }
        showNavigation();
    };

	var makeStreams = function(streams) {
	    var itemsCount = streams.length < MAX_ITEMS_IN_PAGE ? streams.length : MAX_ITEMS_IN_PAGE;
        var body = document.getElementsByTagName("body")[0];
    	var list = document.createElement("ul");
    	body.appendChild(list);

    	for (var i = 0; i < itemsCount; i++) {
            var s = streams[i];
    		var li = document.createElement("li");
    		var div = document.createElement("div");
            div.style.clear="both";
    		li.appendChild(div);
    		list.appendChild(li);
    		makeListItem(s, div);
    	}
	};

	var makeListItem = function(data, liDOM) {
        var divLeft = document.createElement("div");
        var divRight = document.createElement("div");
        var imgSrc = data.preview.small;
        var img = document.createElement("img");
        var dispName = document.createElement("h4");
        var gameName = document.createElement("p");
        divLeft.style.float = "left";
        divRight.style.float = "left";
        dispName.innerText = data.channel.display_name;
        divRight.appendChild(dispName);
        gameName.innerText = data.game + " - " + data.viewers + " viewers";
        divRight.appendChild(gameName);
        img.src = imgSrc;
        divLeft.appendChild(img);
        liDOM.appendChild(divLeft);
        liDOM.appendChild(divRight);

	};

	return {

		loadStreams: function(stream) {
			var url = baseURL + "/search/streams?q=" + stream;
			this.callback = makePage,
            this.currentPage = 0,
            this.stream = stream,
			loadJSONP(url);
		},

        navigate: function(direction) {
            if ((currentPage==0 && direction==-1) ||
                (currentPage+1==Math.ceil(this.total/MAX_ITEMS_IN_PAGE) && direction==1)) {
                return false;
            } 
            currentPage += direction;
            offset = currentPage*MAX_ITEMS_IN_PAGE;
            var url = baseURL + "/search/streams?q="+this.stream+"&offset="+offset+
                                 "&limit="+MAX_ITEMS_IN_PAGE;
            this.callback = makePage,
            loadJSONP(url);
        }
	}
})()