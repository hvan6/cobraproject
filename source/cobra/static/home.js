function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Bedroom slider
$( function() {
  $( "#slider-bedroom" ).slider({
    range: true,
    min: 0,
    max: 10,
    values: [ 2, 3 ],
    slide: function( event, ui ) {
      $( "#inputBedroom" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      $("#minBedroom").val($( "#slider-bedroom" ).slider( "values", 0 ));
      $("#maxBedroom").val($( "#slider-bedroom" ).slider( "values", 1 ));
    }
  });
  $( "#inputBedroom" ).val( $( "#slider-bedroom" ).slider( "values", 0 ) +
    " - " + $( "#slider-bedroom" ).slider( "values", 1 ) );
} );

// Bathroom slider
$( function() {
  $( "#slider-bathroom" ).slider({
    range: true,
    min: 0,
    max: 32,
    values: [ 1, 2 ],
    slide: function( event, ui ) {
      $( "#inputBathroom" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      $("#minBathroom").val($( "#slider-bathroom" ).slider( "values", 0 ));
      $("#maxBathroom").val($( "#slider-bathroom" ).slider( "values", 1 ));
    }
  });
  $( "#inputBathroom" ).val( $( "#slider-bathroom" ).slider( "values", 0 ) +
    " - " + $( "#slider-bathroom" ).slider( "values", 1 ) );
} );

// Year Built slider
$( function() {
  $( "#slider-yearbuilt" ).slider({
    range: true,
    min: 1801,
    max: 2016,
    values: [ 1945, 2000 ],
    slide: function( event, ui ) {
      $( "#inputYearBuilt" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      $("#minYearbuilt").val($( "#slider-yearbuilt" ).slider( "values", 0 ));
      $("#maxYearbuilt").val($( "#slider-yearbuilt" ).slider( "values", 1 ));
    }
  });
  $( "#inputYearBuilt" ).val( $( "#slider-yearbuilt" ).slider( "values", 0 ) +
    " - " + $( "#slider-yearbuilt" ).slider( "values", 1 ) );
} );

// Lot Size slider
$( function() {
  $( "#slider-lotsize" ).slider({
    range: true,
    min: 0,
    max: 99998,
    values: [ 0, 12000 ],
    slide: function( event, ui ) {
      $( "#inputLotSize" ).val( numberWithCommas(ui.values[ 0 ]) + " - " + numberWithCommas(ui.values[ 1 ] ));
      $("#minLotSize").val($( "#slider-lotsize" ).slider( "values", 0 ));
      $("#maxLotSize").val($( "#slider-lotsize" ).slider( "values", 1 ));
      console.log($("#maxLotSize").val());
    }
  });
  $( "#inputLotSize" ).val( numberWithCommas($( "#slider-lotsize" ).slider( "values", 0 )) +
    " - " + numberWithCommas($( "#slider-lotsize" ).slider( "values", 1 ) ));
} );
