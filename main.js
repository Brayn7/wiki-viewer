/*
thanks to these sites for the autocomplete

http://w3lessons.info/2015/03/01/autocomplete-search-using-wikipedia-api-and-jquery-ui/

https://api.jqueryui.com/autocomplete/

*/

// Url for 10 random articles

var randomURL = "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=info%7Cextracts&generator=random&inprop=url&exchars=175&exlimit=10&exintro=1&explaintext=1&exsectionformat=plain&grnnamespace=0&grnlimit=10&callback=?";



// splits what is typed into the search box and replaces spaces with plus signs

function makeStringWPLus (val){
  return val.split(" ").join("+");
}


// this function removes the populated html from any current searches
// calls the json and populates or repopulates the new info into a list of articles
// appending them to the ul inside the .results div

function populateJSON (url){
  $(".results ul li").remove();
  $.getJSON(url, function(data) {
    
    
   // gets all the keys/page ids 
    var pageKeys = Object.keys(data.query.pages);
    
   // loops thru pageKeys accessing each page object i need and storing them in variables
    for (var i = 0; i < pageKeys.length; i++){
      var title = data.query.pages[pageKeys[i]].title;
      var URL = data.query.pages[pageKeys[i]].fullurl;
      var extract = data.query.pages[pageKeys[i]].extract;
   
      
      // turn into a list item and utilize gathered info from variables
      var html = "<li><a href="+ URL +"><h3 class='title'>"+ title +"</h3><p>"+ extract +"</p></a></li>";
      
      // append to ul
      $(".results ul").append(html);
    }
  });
}


// if random button is clicked populate random articles
$("button").click(function(){
  populateJSON(randomURL);
});


// autocomplete functionality 
$("#search").autocomplete({
  // append menu of suggestions to .search-box div
  appendTo: ".search-box",
  // position menu center bottom plus 40 pixals to .search-box div
  position: { collision: "fit", at: "center bottom+40"},
  
  //while the menu is open dont display any other populated html results and make menu visible
  open: function( event, ui ) {
    $(".results ul").css("display", "none");
    $(".ui-menu").css("display", "block");
  },
  // when menu closes then make .results visible again
  close: function( event, ui ) {
    $(".results ul").attr("style", "initial");
  },
  
  //upon selection (hitting enter)
  select: function(event,ui){
    //turn selected item into a string
    var item = String(ui.item.value);
   
    // url that will be passed into getJSON call via populateJSON() 
    // makeStringWPlus inserts the text that was searched for in search box
    var searchURL = "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cinfo&titles=&generator=search&exchars=175&exlimit=20&explaintext=1&exsectionformat=wiki&exintro=1&inprop=url&gsrsearch=" + makeStringWPLus(item) + "&callback=?";
   
    populateJSON(searchURL);
   
   // close menu after populating html 
   $( "#search" ).autocomplete( "close" ); 
    
  },
  // automatically focuses first item in autocomplete menu
  autoFocus: true,
  // source is where its calling on wikipedia and looking for a list of matching article titles
  //using opensearch and searching for whats in search box
  source: function (request, response){
    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: "jsonp",
      data:{
        "action": "opensearch",
        'format': "json",
        // requesting titles
        "search": request.term
      },
      success: function(data){
        // respond with a list of titles that match
        response(data[1]);
      }
      
    }); 
  }
});
