var gapikey = 'AIzaSyCKMpw2nmPnon_gkh4EIXnbiAmrZNw-v4M';

$(function() {
    
    var searchField = $('#query');
    var icon = $('#search-btn');
    
    
    $('#search-form').submit( function(e) {
        e.preventDefault();
    });
});

function randomQuote() {
 $.ajax({
      url: "https://api.forismatic.com/api/1.0/",
      jsonp: "jsonp",
      dataType: "jsonp",
      data: {
        method: "getQuote",
        lang: "en",
        format: "jsonp"
      },
      success: function(quote) {
        $('#quote').html('&ldquo;'+quote.quoteText+'&rdquo;')
        $('#author').html("-"+quote.quoteAuthor)
      }
    });
}

randomQuote();

//Click on the button to generate another random quote

$('#random').click(function() {
  
    randomQuote();
   
  })

function search() {
    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();  // this probably shouldn't be created as a global
    
    // run get request on API
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: gapikey
        }, function(data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });
}

// Next page function
function nextPage() {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');
    
    
   // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();  // this probably shouldn't be created as a global
    
    // run get request on API
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
}

// Previous page function
function prevPage() {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');
    
    
   // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();  // this probably shouldn't be created as a global
    
    // run get request on API
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
}

// Build output
function getOutput(item) {
    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
  
    
    // Build output string
    var output = 	'<li>' +
        				'<div class="list-left">' +
        					'<img src="' + thumb + '">' +
        				'</div>' +
        				'<div class="list-right">' +
        					'<p><a data-fancybox-type="iFrame" class="fancyboxIframe" href="https://youtube.com/embed/' + videoID + '?rel=0">' + title + '</a></p>' +
        					'<small>By <span class="cTitle">' + channelTitle + 
        				'</div>' +
        			'</li>' +
        			'<div class="clearfix"></div>' +
        			'';
    return output;
}

function getButtons(prevPageToken, nextPageToken) {
    if(!prevPageToken) {
        var btnoutput = 	'<div class="button-container">' +
            					'<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            						'onclick = "nextPage();">Next Page</button>' +
            				'</div>';
    } else {
        var btnoutput = 	'<div class="button-container">' +
								'<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
            						'onclick = "prevPage();">Prev Page</button>' +            
            					'<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            						'onclick = "nextPage();">Next Page</button>' +
            				'</div>';        
    }
    
    return btnoutput;
}