var map;
Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

// var lalatlon = {lat:34.052235,lon:-118.243683};
var lalatlon = {lat:$('#criteriadata').data("lat"),lon:$('#criteriadata').data("lon")};

function showPageLoading() {
    $("#loader").show();
    $("#popupBackground").css({ "opacity": "0.3", "background": "#000000" });
    $("#popupBackground").show();
}

function hidePageLoading() {
    $("#loader").hide();
    $("#popupBackground").hide();
    $("#popupBackground").css({ "opacity": "0.3", "background": "#000000" });
}

var ajaxdata = { zipcode: $('#criteriadata').data("zipcode"),
                  minbed: $('#criteriadata').data("minbed"),
                  maxbed: $('#criteriadata').data("maxbed"),
                  minbath: $('#criteriadata').data("minbath"),
                  maxbath: $('#criteriadata').data("maxbath"),
                  minbuilt: $('#criteriadata').data("minbuilt"),
                  maxbuilt: $('#criteriadata').data("maxbuilt"),
                  minlotsize: $('#criteriadata').data("minlotsize"),
                  maxlotsize: $('#criteriadata').data("maxlotsize"),
                  lat: $('#criteriadata').data("lat"),
                  lon: $('#criteriadata').data("lon"),
                  queryHouseByCounty: $('#queryHouseByCounty').val()
                }
console.log(ajaxdata);

function getmedian() {
  $.ajax({
    url: "/getmedianbyzip",
    //url: "http://ec2-54-183-131-70.us-west-1.compute.amazonaws.com/getmedianbyzip",
    type: 'POST',
    data: ajaxdata,
    beforeSend: function(){
    // Show image container
      showPageLoading();
    },
    success: function(res){
      hidePageLoading();
      // console.log(res.result);
      // console.log("success");
      drawMedian(res.result);
    },
    error: function(error) {
      hidePageLoading();
      alert("Failed");
      console.log(error);
    },
    complete:function(data){
    // Hide image container
      hidePageLoading();
    }
  });
}

median_arr = [];

function drawMedian(result) {

  // var result = '[{"zipcode":90001,"ziplat":33.97397,"ziplon":-118.24953,"city":"Los Angeles","mean":351244.7463768121,"median":351485.714285714},{"zipcode":90002,"ziplat":33.94906,"ziplon":-118.24673,"city":"Los Angeles","mean":308474.9789712074,"median":307736.363636364},{"zipcode":90003,"ziplat":33.96411,"ziplon":-118.2737,"city":"Los Angeles","mean":336397.8484202372,"median":316579.2207792205},{"zipcode":90004,"ziplat":34.07621,"ziplon":-118.31084,"city":"Los Angeles","mean":650449.5411255407,"median":569975.324675325},{"zipcode":90005,"ziplat":34.05915,"ziplon":-118.30643,"city":"Los Angeles","mean":623526.3515932694,"median":637310.3896103899},{"zipcode":90006,"ziplat":34.04801,"ziplon":-118.29418,"city":"Los Angeles","mean":425817.373737374,"median":394879.220779221},{"zipcode":90007,"ziplat":34.02809,"ziplon":-118.28489,"city":"Los Angeles","mean":270864.1558441559,"median":262733.116883117},{"zipcode":90008,"ziplat":34.00956,"ziplon":-118.34706,"city":"Los Angeles","mean":511093.2419004479,"median":449888.961038961},{"zipcode":90011,"ziplat":34.00714,"ziplon":-118.25874,"city":"Los Angeles","mean":355979.6284007963,"median":309659.0909090909},{"zipcode":90012,"ziplat":34.06599,"ziplon":-118.23823,"city":"Los Angeles","mean":510908.6909090909,"median":450098.7012987015},{"zipcode":90015,"ziplat":34.03939,"ziplon":-118.26645,"city":"Los Angeles","mean":633691.3782252985,"median":563327.2727272729},{"zipcode":90016,"ziplat":34.02872,"ziplon":-118.3546,"city":"Los Angeles","mean":372648.2667409159,"median":312740.909090909},{"zipcode":90017,"ziplat":34.05291,"ziplon":-118.2643,"city":"Los Angeles","mean":1132527.1236959763,"median":1075258.4415584449},{"zipcode":90018,"ziplat":34.02887,"ziplon":-118.3172,"city":"Los Angeles","mean":377493.3977916356,"median":359471.428571429},{"zipcode":90019,"ziplat":34.04864,"ziplon":-118.33868,"city":"Los Angeles","mean":561153.9305065798,"median":468357.7922077921},{"zipcode":90020,"ziplat":34.06639,"ziplon":-118.3099,"city":"Los Angeles","mean":445854.4280866479,"median":430610.38961039},{"zipcode":90022,"ziplat":34.02452,"ziplon":-118.15609,"city":"Los Angeles","mean":387714.4546348835,"median":394742.857142857},{"zipcode":90023,"ziplat":34.02276,"ziplon":-118.1999,"city":"Los Angeles","mean":331105.8608058607,"median":309846.753246753},{"zipcode":90024,"ziplat":34.06568,"ziplon":-118.43506,"city":"Los Angeles","mean":750447.5364184404,"median":714793.5064935065},{"zipcode":90025,"ziplat":34.04544,"ziplon":-118.44586,"city":"Los Angeles","mean":717323.3238782866,"median":706711.6883116879},{"zipcode":90026,"ziplat":34.07927,"ziplon":-118.26301,"city":"Los Angeles","mean":604374.0303913777,"median":512374.0259740261},{"zipcode":90027,"ziplat":34.12521,"ziplon":-118.29057,"city":"Los Angeles","mean":775973.6899065844,"median":646738.3116883115},{"zipcode":90028,"ziplat":34.09989,"ziplon":-118.32692,"city":"Los Angeles","mean":476460.4359925789,"median":465549.3506493505},{"zipcode":90029,"ziplat":34.08984,"ziplon":-118.29471,"city":"Los Angeles","mean":532407.8817733991,"median":573382.4675324676},{"zipcode":90031,"ziplat":34.08022,"ziplon":-118.21073,"city":"Los Angeles","mean":437216.6955266956,"median":380013.6363636365},{"zipcode":90032,"ziplat":34.07954,"ziplon":-118.17806,"city":"Los Angeles","mean":342883.3819836504,"median":311985.714285714},{"zipcode":90033,"ziplat":34.05105,"ziplon":-118.21159,"city":"Los Angeles","mean":307013.6778115502,"median":309311.038961039},{"zipcode":90034,"ziplat":34.03068,"ziplon":-118.39954,"city":"Los Angeles","mean":725364.6487179279,"median":631175.324675325},{"zipcode":90035,"ziplat":34.05179,"ziplon":-118.38354,"city":"Los Angeles","mean":851131.1396103902,"median":751820.779220779},{"zipcode":90036,"ziplat":34.07016,"ziplon":-118.34987,"city":"Los Angeles","mean":749483.3190394506,"median":676070.779220779},{"zipcode":90037,"ziplat":34.00268,"ziplon":-118.28748,"city":"Los Angeles","mean":357453.3696033697,"median":322050.6493506495},{"zipcode":90038,"ziplat":34.08876,"ziplon":-118.32652,"city":"Los Angeles","mean":608442.8407036003,"median":555901.298701299},{"zipcode":90039,"ziplat":34.11178,"ziplon":-118.26001,"city":"Los Angeles","mean":704024.2412573942,"median":575275.9740259741},{"zipcode":90040,"ziplat":33.99352,"ziplon":-118.14907,"city":"Los Angeles","mean":337325.7923146815,"median":341915.584415584},{"zipcode":90041,"ziplat":34.13762,"ziplon":-118.20763,"city":"Los Angeles","mean":559318.3125137566,"median":484924.675324675},{"zipcode":90042,"ziplat":34.11461,"ziplon":-118.19194,"city":"Los Angeles","mean":452775.2649822183,"median":412649.350649351},{"zipcode":90043,"ziplat":33.98886,"ziplon":-118.33517,"city":"Los Angeles","mean":502483.4114339262,"median":432793.506493506},{"zipcode":90044,"ziplat":33.95278,"ziplon":-118.29188,"city":"Los Angeles","mean":351013.6977690961,"median":336568.831168831},{"zipcode":90045,"ziplat":33.95296,"ziplon":-118.40014,"city":"Los Angeles","mean":722470.8106533372,"median":668062.3376623379},{"zipcode":90046,"ziplat":34.10747,"ziplon":-118.36528,"city":"Los Angeles","mean":984272.2903075046,"median":849844.1558441559},{"zipcode":90047,"ziplat":33.9545,"ziplon":-118.309,"city":"Los Angeles","mean":358445.6164509848,"median":351581.168831169},{"zipcode":90048,"ziplat":34.07299,"ziplon":-118.37264,"city":"Los Angeles","mean":768238.017245913,"median":661142.8571428575},{"zipcode":90049,"ziplat":34.08719,"ziplon":-118.48926,"city":"Los Angeles","mean":1090772.3738761228,"median":904892.2077922079},{"zipcode":90056,"ziplat":33.98806,"ziplon":-118.37034,"city":"Los Angeles","mean":652886.4870034236,"median":619022.077922078},{"zipcode":90057,"ziplat":34.06224,"ziplon":-118.27716,"city":"Los Angeles","mean":389643.4767067794,"median":367535.7142857145},{"zipcode":90059,"ziplat":33.92627,"ziplon":-118.24965,"city":"Los Angeles","mean":326010.4092647744,"median":320749.350649351},{"zipcode":90061,"ziplat":33.92045,"ziplon":-118.27403,"city":"Los Angeles","mean":316006.4961336704,"median":316464.935064935},{"zipcode":90062,"ziplat":34.00376,"ziplon":-118.30875,"city":"Los Angeles","mean":357620.3007518797,"median":332081.818181818},{"zipcode":90063,"ziplat":34.04507,"ziplon":-118.18593,"city":"Los Angeles","mean":339174.6957711127,"median":331896.103896104},{"zipcode":90064,"ziplat":34.03702,"ziplon":-118.42492,"city":"Los Angeles","mean":771253.2936176989,"median":673063.636363636},{"zipcode":90065,"ziplat":34.10891,"ziplon":-118.22759,"city":"Los Angeles","mean":567881.4729736674,"median":499224.6753246755},{"zipcode":90066,"ziplat":34.00125,"ziplon":-118.43066,"city":"Los Angeles","mean":709983.9883400527,"median":580931.8181818181},{"zipcode":90067,"ziplat":34.0577,"ziplon":-118.41402,"city":"Los Angeles","mean":970467.6193371849,"median":939707.7922077924},{"zipcode":90068,"ziplat":34.12835,"ziplon":-118.32829,"city":"Los Angeles","mean":890082.0097018168,"median":748920.1298701295},{"zipcode":90069,"ziplat":34.09386,"ziplon":-118.38171,"city":"West Hollywood","mean":915165.2903035849,"median":784302.5974025971},{"zipcode":90077,"ziplat":34.10546,"ziplon":-118.45615,"city":"Los Angeles","mean":1260160.5427479274,"median":1034142.85714286},{"zipcode":90201,"ziplat":33.97074,"ziplon":-118.17084,"city":"Bell Gardens","mean":420647.7181565738,"median":414303.896103896},{"zipcode":90210,"ziplat":34.10103,"ziplon":-118.41476,"city":"Beverly Hills","mean":1319199.3123270182,"median":1076430.5194805199},{"zipcode":90211,"ziplat":34.06496,"ziplon":-118.38294,"city":"Beverly Hills","mean":944612.7076696886,"median":923322.077922078},{"zipcode":90212,"ziplat":34.06218,"ziplon":-118.40193,"city":"Beverly Hills","mean":1106421.21733688,"median":1045218.18181818},{"zipcode":90220,"ziplat":33.88079,"ziplon":-118.23607,"city":"Compton","mean":398443.467835246,"median":409281.1688311684},{"zipcode":90221,"ziplat":33.88615,"ziplon":-118.20594,"city":"Compton","mean":418828.7550969084,"median":422571.4285714285},{"zipcode":90222,"ziplat":33.91238,"ziplon":-118.2365,"city":"Compton","mean":365247.9507150153,"median":351716.233766234},{"zipcode":90230,"ziplat":33.99722,"ziplon":-118.3946,"city":"Culver City","mean":560796.3715105071,"median":507361.6883116885},{"zipcode":90232,"ziplat":34.01879,"ziplon":-118.39182,"city":"Culver City","mean":739660.8700716326,"median":634437.6623376621},{"zipcode":90240,"ziplat":33.9568,"ziplon":-118.11869,"city":"Downey","mean":503778.5444339258,"median":504959.7402597405},{"zipcode":90241,"ziplat":33.94087,"ziplon":-118.12923,"city":"Downey","mean":487327.9350916298,"median":486690.2597402595},{"zipcode":90242,"ziplat":33.92214,"ziplon":-118.14147,"city":"Downey","mean":444061.7818570573,"median":434577.272727273},{"zipcode":90245,"ziplat":33.91695,"ziplon":-118.40206,"city":"El Segundo","mean":639117.6927885778,"median":574858.4415584415},{"zipcode":90247,"ziplat":33.8914,"ziplon":-118.29737,"city":"Gardena","mean":375977.0818021146,"median":360235.064935065},{"zipcode":90248,"ziplat":33.87669,"ziplon":-118.2835,"city":"Gardena","mean":361777.1411650237,"median":342415.584415584},{"zipcode":90249,"ziplat":33.9015,"ziplon":-118.31708,"city":"Gardena","mean":405261.2929257752,"median":383561.038961039},{"zipcode":90250,"ziplat":33.91437,"ziplon":-118.3493,"city":"Hawthorne","mean":498382.7938164684,"median":463157.142857143},{"zipcode":90254,"ziplat":33.86546,"ziplon":-118.39665,"city":"Hermosa Beach","mean":805567.4419144626,"median":682775.3246753246},{"zipcode":90255,"ziplat":33.97703,"ziplon":-118.2173,"city":"Huntington Park","mean":392457.9902597398,"median":373359.7402597405},{"zipcode":90260,"ziplat":33.88829,"ziplon":-118.35125,"city":"Lawndale","mean":444046.7015381935,"median":424052.5974025975},{"zipcode":90262,"ziplat":33.92365,"ziplon":-118.20053,"city":"Lynwood","mean":406385.6376769289,"median":408581.168831169},{"zipcode":90265,"ziplat":34.07191,"ziplon":-118.8499,"city":"Malibu","mean":1782172.302874428,"median":1183787.0129870099},{"zipcode":90266,"ziplat":33.8895,"ziplon":-118.39718,"city":"Manhattan Beach","mean":944828.417738434,"median":701703.896103896},{"zipcode":90270,"ziplat":33.98805,"ziplon":-118.18597,"city":"Maywood","mean":419468.5640971932,"median":418832.467532468},{"zipcode":90272,"ziplat":34.07991,"ziplon":-118.54219,"city":"Pacific Palisades","mean":1249781.7419463636,"median":1014483.11688312},{"zipcode":90274,"ziplat":33.77734,"ziplon":-118.36893,"city":"Palos Verdes Peninsula","mean":1051623.1582813081,"median":995548.051948052},{"zipcode":90275,"ziplat":33.75545,"ziplon":-118.36393,"city":"Rancho Palos Verdes","mean":778822.9465405712,"median":728457.142857143},{"zipcode":90277,"ziplat":33.83077,"ziplon":-118.38458,"city":"Redondo Beach","mean":780702.1277464669,"median":697154.5454545454},{"zipcode":90278,"ziplat":33.87325,"ziplon":-118.37037,"city":"Redondo Beach","mean":666547.223038399,"median":636312.3376623376},{"zipcode":90280,"ziplat":33.94467,"ziplon":-118.19268,"city":"South Gate","mean":417151.0318484764,"median":417514.285714286},{"zipcode":90290,"ziplat":34.09588,"ziplon":-118.60708,"city":"Topanga","mean":908708.4833621311,"median":796966.233766234},{"zipcode":90291,"ziplat":33.99437,"ziplon":-118.46344,"city":"Venice","mean":962377.4385373986,"median":747805.1948051946},{"zipcode":90292,"ziplat":33.97831,"ziplon":-118.44761,"city":"Marina Del Rey","mean":895361.0998497049,"median":846251.948051948},{"zipcode":90293,"ziplat":33.95033,"ziplon":-118.43721,"city":"Playa Del Rey","mean":678244.4782970612,"median":627636.363636364},{"zipcode":90301,"ziplat":33.95652,"ziplon":-118.35864,"city":"Inglewood","mean":351660.7674268709,"median":324393.506493506},{"zipcode":90302,"ziplat":33.97472,"ziplon":-118.35549,"city":"Inglewood","mean":342632.6027691321,"median":303739.6103896105},{"zipcode":90303,"ziplat":33.9381,"ziplon":-118.3323,"city":"Inglewood","mean":414223.4468026033,"median":407292.857142857},{"zipcode":90304,"ziplat":33.93798,"ziplon":-118.35854,"city":"Inglewood","mean":445260.9938821517,"median":429068.831168831},{"zipcode":90305,"ziplat":33.95959,"ziplon":-118.33015,"city":"Inglewood","mean":421663.2851239668,"median":404370.1298701295},{"zipcode":90402,"ziplat":34.03562,"ziplon":-118.50364,"city":"Santa Monica","mean":1580728.5119744374,"median":1242397.4025973999},{"zipcode":90403,"ziplat":34.03106,"ziplon":-118.4901,"city":"Santa Monica","mean":888960.8681525768,"median":800615.5844155841},{"zipcode":90404,"ziplat":34.02657,"ziplon":-118.47368,"city":"Santa Monica","mean":717147.4825174826,"median":695172.077922078},{"zipcode":90405,"ziplat":34.01179,"ziplon":-118.46821,"city":"Santa Monica","mean":936256.6626216718,"median":841379.2207792209},{"zipcode":90501,"ziplat":33.8334,"ziplon":-118.31426,"city":"Torrance","mean":496412.8787072951,"median":477664.935064935},{"zipcode":90502,"ziplat":33.83499,"ziplon":-118.29292,"city":"Torrance","mean":413880.9957595228,"median":408994.8051948055},{"zipcode":90503,"ziplat":33.84073,"ziplon":-118.35357,"city":"Torrance","mean":594669.0757058733,"median":575816.883116883},{"zipcode":90504,"ziplat":33.86682,"ziplon":-118.33114,"city":"Torrance","mean":481933.5781160667,"median":463164.935064935},{"zipcode":90505,"ziplat":33.80887,"ziplon":-118.34802,"city":"Torrance","mean":623439.2299927507,"median":596374.0259740259},{"zipcode":90601,"ziplat":34.00834,"ziplon":-118.03135,"city":"Whittier","mean":454106.8929727095,"median":435277.2727272725},{"zipcode":90602,"ziplat":33.97199,"ziplon":-118.0223,"city":"Whittier","mean":497131.8177560147,"median":470612.987012987},{"zipcode":90603,"ziplat":33.94541,"ziplon":-117.99253,"city":"Whittier","mean":473070.3986902166,"median":454714.285714286},{"zipcode":90604,"ziplat":33.93012,"ziplon":-118.01225,"city":"Whittier","mean":423119.2116814124,"median":409188.961038961},{"zipcode":90605,"ziplat":33.94983,"ziplon":-118.02329,"city":"Whittier","mean":431986.1853568275,"median":419468.831168831},{"zipcode":90606,"ziplat":33.97767,"ziplon":-118.0658,"city":"Whittier","mean":400242.3569927178,"median":400383.116883117},{"zipcode":90638,"ziplat":33.90241,"ziplon":-118.0092,"city":"La Mirada","mean":464482.0974995139,"median":448553.246753247},{"zipcode":90640,"ziplat":34.01508,"ziplon":-118.11073,"city":"Montebello","mean":483966.6435229974,"median":463104.5454545455},{"zipcode":90650,"ziplat":33.90685,"ziplon":-118.08263,"city":"Norwalk","mean":406789.8798238894,"median":408788.961038961},{"zipcode":90660,"ziplat":33.98882,"ziplon":-118.09063,"city":"Pico Rivera","mean":382884.2112565797,"median":387162.987012987},{"zipcode":90670,"ziplat":33.93301,"ziplon":-118.06264,"city":"Santa Fe Springs","mean":412811.635646494,"median":414106.4935064935},{"zipcode":90701,"ziplat":33.86763,"ziplon":-118.08062,"city":"Artesia","mean":371681.9354838709,"median":341601.298701299},{"zipcode":90703,"ziplat":33.86786,"ziplon":-118.06874,"city":"Cerritos","mean":463401.6639919963,"median":433693.5064935065},{"zipcode":90704,"ziplat":33.38251,"ziplon":-118.43439,"city":"Avalon","mean":967745.680963773,"median":894590.9090909089},{"zipcode":90706,"ziplat":33.88802,"ziplon":-118.12708,"city":"Bellflower","mean":424116.6484974878,"median":416383.116883117},{"zipcode":90710,"ziplat":33.79809,"ziplon":-118.29907,"city":"Harbor City","mean":435906.0630504452,"median":408880.519480519},{"zipcode":90712,"ziplat":33.84901,"ziplon":-118.14672,"city":"Lakewood","mean":483198.8358093402,"median":478555.844155844},{"zipcode":90713,"ziplat":33.84798,"ziplon":-118.11265,"city":"Lakewood","mean":475297.1538475075,"median":465906.493506494},{"zipcode":90715,"ziplat":33.84032,"ziplon":-118.0788,"city":"Lakewood","mean":399393.1371856282,"median":391329.87012987},{"zipcode":90716,"ziplat":33.83032,"ziplon":-118.073,"city":"Hawaiian Gardens","mean":304778.0712675755,"median":300162.987012987},{"zipcode":90717,"ziplat":33.79383,"ziplon":-118.31719,"city":"Lomita","mean":517533.8615582897,"median":502344.155844156},{"zipcode":90723,"ziplat":33.89743,"ziplon":-118.16482,"city":"Paramount","mean":338117.6642707773,"median":329294.805194805},{"zipcode":90731,"ziplat":33.73334,"ziplon":-118.27432,"city":"San Pedro","mean":476954.473669578,"median":450931.168831169},{"zipcode":90732,"ziplat":33.74507,"ziplon":-118.31012,"city":"San Pedro","mean":528451.9998618404,"median":461209.090909091},{"zipcode":90744,"ziplat":33.77864,"ziplon":-118.26167,"city":"Wilmington","mean":335315.3988868279,"median":343590.2597402595},{"zipcode":90745,"ziplat":33.82124,"ziplon":-118.26441,"city":"Carson","mean":412990.5953137774,"median":406208.4415584415},{"zipcode":90746,"ziplat":33.85888,"ziplon":-118.25525,"city":"Carson","mean":435154.8713550604,"median":423661.038961039},{"zipcode":90755,"ziplat":33.80289,"ziplon":-118.16771,"city":"Signal Hill","mean":471730.7885807884,"median":454688.3116883115},{"zipcode":90802,"ziplat":33.75021,"ziplon":-118.21141,"city":"Long Beach","mean":452384.4904316867,"median":380498.051948052},{"zipcode":90803,"ziplat":33.76161,"ziplon":-118.12218,"city":"Long Beach","mean":644261.2193156871,"median":594302.5974025971},{"zipcode":90804,"ziplat":33.78185,"ziplon":-118.14863,"city":"Long Beach","mean":383762.642146988,"median":361350.649350649},{"zipcode":90805,"ziplat":33.86491,"ziplon":-118.18054,"city":"Long Beach","mean":378396.8080664416,"median":364750.649350649},{"zipcode":90806,"ziplat":33.8045,"ziplon":-118.18761,"city":"Long Beach","mean":419499.2933260661,"median":388831.168831169},{"zipcode":90807,"ziplat":33.82795,"ziplon":-118.1746,"city":"Long Beach","mean":483396.9512158381,"median":431503.896103896},{"zipcode":90808,"ziplat":33.82396,"ziplon":-118.11226,"city":"Long Beach","mean":504973.1732913553,"median":481677.922077922},{"zipcode":90810,"ziplat":33.81894,"ziplon":-118.22111,"city":"Long Beach","mean":357243.9899859171,"median":350264.935064935},{"zipcode":90813,"ziplat":33.78237,"ziplon":-118.19684,"city":"Long Beach","mean":301867.5430260793,"median":292968.831168831},{"zipcode":90814,"ziplat":33.77162,"ziplon":-118.14358,"city":"Long Beach","mean":499895.7103126319,"median":470833.766233766},{"zipcode":90815,"ziplat":33.79572,"ziplon":-118.11641,"city":"Long Beach","mean":517107.3116524364,"median":485964.935064935},{"zipcode":91001,"ziplat":34.19544,"ziplon":-118.13796,"city":"Altadena","mean":543896.4564804826,"median":479998.0519480516},{"zipcode":91006,"ziplat":34.13599,"ziplon":-118.02675,"city":"Arcadia","mean":695237.527248165,"median":627872.7272727275},{"zipcode":91007,"ziplat":34.12865,"ziplon":-118.04815,"city":"Arcadia","mean":773272.899642869,"median":650140.25974026},{"zipcode":91008,"ziplat":34.15344,"ziplon":-117.96823,"city":"Duarte","mean":1151390.3050437933,"median":717590.25974026},{"zipcode":91010,"ziplat":34.14074,"ziplon":-117.95671,"city":"Duarte","mean":418831.5444652088,"median":394411.688311688},{"zipcode":91011,"ziplat":34.22161,"ziplon":-118.20516,"city":"La Canada Flintridge","mean":945972.9762718488,"median":882546.7532467535},{"zipcode":91016,"ziplat":34.15213,"ziplon":-118.00069,"city":"Monrovia","mean":562806.9809925172,"median":522372.727272727},{"zipcode":91020,"ziplat":34.21129,"ziplon":-118.23064,"city":"Montrose","mean":505810.9756097564,"median":487156.4935064935},{"zipcode":91024,"ziplat":34.16871,"ziplon":-118.05037,"city":"Sierra Madre","mean":667039.8931433667,"median":636783.116883117},{"zipcode":91030,"ziplat":34.1102,"ziplon":-118.15735,"city":"South Pasadena","mean":701496.19746248,"median":630419.48051948},{"zipcode":91040,"ziplat":34.26177,"ziplon":-118.33715,"city":"Sunland","mean":470840.0845399066,"median":453041.558441558},{"zipcode":91042,"ziplat":34.31653,"ziplon":-118.24912,"city":"Tujunga","mean":480288.3331339982,"median":457535.064935065},{"zipcode":91101,"ziplat":34.14657,"ziplon":-118.13942,"city":"Pasadena","mean":510084.5009097187,"median":534020.779220779},{"zipcode":91103,"ziplat":34.16898,"ziplon":-118.16597,"city":"Pasadena","mean":550418.4535464543,"median":448017.5324675325},{"zipcode":91104,"ziplat":34.16784,"ziplon":-118.12348,"city":"Pasadena","mean":537055.8758314844,"median":482396.103896104},{"zipcode":91105,"ziplat":34.13821,"ziplon":-118.16677,"city":"Pasadena","mean":792016.006312989,"median":750132.4675324679},{"zipcode":91106,"ziplat":34.13868,"ziplon":-118.1282,"city":"Pasadena","mean":526506.6987012984,"median":493245.4545454545},{"zipcode":91107,"ziplat":34.15833,"ziplon":-118.08716,"city":"Pasadena","mean":642300.3688048887,"median":584785.714285714},{"zipcode":91108,"ziplat":34.12239,"ziplon":-118.11338,"city":"San Marino","mean":1351295.1267482524,"median":1274275.3246753248},{"zipcode":91201,"ziplat":34.17031,"ziplon":-118.28913,"city":"Glendale","mean":503217.1572280181,"median":478832.4675324675},{"zipcode":91202,"ziplat":34.16784,"ziplon":-118.26844,"city":"Glendale","mean":492484.2969973286,"median":445109.74025974},{"zipcode":91203,"ziplat":34.15296,"ziplon":-118.26425,"city":"Glendale","mean":386229.470311348,"median":378078.5714285715},{"zipcode":91204,"ziplat":34.13636,"ziplon":-118.26098,"city":"Glendale","mean":377152.9336734695,"median":381751.298701299},{"zipcode":91205,"ziplat":34.13666,"ziplon":-118.24332,"city":"Glendale","mean":416830.0519480518,"median":388547.4025974025},{"zipcode":91206,"ziplat":34.16068,"ziplon":-118.21352,"city":"Glendale","mean":498954.584058355,"median":449511.038961039},{"zipcode":91207,"ziplat":34.18361,"ziplon":-118.25864,"city":"Glendale","mean":621244.8965097406,"median":543376.6233766235},{"zipcode":91208,"ziplat":34.19251,"ziplon":-118.23657,"city":"Glendale","mean":639010.9884022544,"median":568980.519480519},{"zipcode":91214,"ziplat":34.23671,"ziplon":-118.24925,"city":"La Crescenta","mean":556644.9304934182,"median":526349.350649351},{"zipcode":91301,"ziplat":34.12274,"ziplon":-118.75727,"city":"Agoura Hills","mean":525455.0232724671,"median":478797.402597403},{"zipcode":91302,"ziplat":34.12426,"ziplon":-118.67012,"city":"Calabasas","mean":698944.3152230514,"median":584931.168831169},{"zipcode":91303,"ziplat":34.19794,"ziplon":-118.60156,"city":"Canoga Park","mean":418950.2703853523,"median":383435.064935065},{"zipcode":91304,"ziplat":34.22466,"ziplon":-118.6325,"city":"Canoga Park","mean":471667.6575802892,"median":441675.974025974},{"zipcode":91306,"ziplat":34.20927,"ziplon":-118.5754,"city":"Winnetka","mean":436151.4142030149,"median":416125.9740259741},{"zipcode":91307,"ziplat":34.20164,"ziplon":-118.66216,"city":"West Hills","mean":517879.5768257136,"median":496988.311688312},{"zipcode":91311,"ziplat":34.28937,"ziplon":-118.60742,"city":"Chatsworth","mean":489284.6982254054,"median":465377.922077922},{"zipcode":91316,"ziplat":34.16039,"ziplon":-118.51669,"city":"Encino","mean":494004.6393309396,"median":427248.051948052},{"zipcode":91321,"ziplat":34.3691,"ziplon":-118.48598,"city":"Newhall","mean":402599.3348115297,"median":376486.3636363635},{"zipcode":91324,"ziplat":34.23901,"ziplon":-118.54958,"city":"Northridge","mean":501802.180700496,"median":494458.4415584415},{"zipcode":91325,"ziplat":34.23602,"ziplon":-118.51759,"city":"Northridge","mean":492128.8593807157,"median":460155.844155844},{"zipcode":91326,"ziplat":34.28048,"ziplon":-118.55758,"city":"Porter Ranch","mean":584757.3625847495,"median":579161.038961039},{"zipcode":91331,"ziplat":34.25563,"ziplon":-118.42076,"city":"Pacoima","mean":358357.9167595409,"median":347661.038961039},{"zipcode":91335,"ziplat":34.20105,"ziplon":-118.54067,"city":"Reseda","mean":423825.2907846795,"median":405132.4675324675},{"zipcode":91340,"ziplat":34.28671,"ziplon":-118.4351,"city":"San Fernando","mean":379859.770668812,"median":369283.766233766},{"zipcode":91342,"ziplat":34.31515,"ziplon":-118.3851,"city":"Sylmar","mean":398952.3372491428,"median":376031.1688311684},{"zipcode":91343,"ziplat":34.23827,"ziplon":-118.48067,"city":"North Hills","mean":455429.2801001961,"median":434125.974025974},{"zipcode":91344,"ziplat":34.29392,"ziplon":-118.5075,"city":"Granada Hills","mean":498325.6265356281,"median":489281.168831169},{"zipcode":91345,"ziplat":34.26594,"ziplon":-118.45945,"city":"Mission Hills","mean":408182.4728117411,"median":393161.038961039},{"zipcode":91350,"ziplat":34.43358,"ziplon":-118.50072,"city":"Santa Clarita","mean":509525.9251054551,"median":506451.948051948},{"zipcode":91351,"ziplat":34.43321,"ziplon":-118.46293,"city":"Canyon Country","mean":447006.0770536466,"median":437250.649350649},{"zipcode":91352,"ziplat":34.23193,"ziplon":-118.3664,"city":"Sun Valley","mean":403294.7701349208,"median":377949.350649351},{"zipcode":91354,"ziplat":34.46493,"ziplon":-118.55429,"city":"Valencia","mean":609124.6475350609,"median":614088.9610389611},{"zipcode":91355,"ziplat":34.42466,"ziplon":-118.58923,"city":"Valencia","mean":559397.3212550589,"median":546786.363636364},{"zipcode":91356,"ziplat":34.15508,"ziplon":-118.54751,"city":"Tarzana","mean":498761.0756753802,"median":394479.8701298705},{"zipcode":91364,"ziplat":34.15476,"ziplon":-118.59509,"city":"Woodland Hills","mean":646340.3733601103,"median":649436.363636364},{"zipcode":91367,"ziplat":34.17705,"ziplon":-118.61531,"city":"Woodland Hills","mean":563784.4013661611,"median":527922.077922078},{"zipcode":91381,"ziplat":34.37747,"ziplon":-118.61311,"city":"Stevenson Ranch","mean":656446.4416456025,"median":627520.779220779},{"zipcode":91384,"ziplat":34.53072,"ziplon":-118.6864,"city":"Castaic","mean":477796.2448790048,"median":460697.4025974025},{"zipcode":91387,"ziplat":34.39878,"ziplon":-118.37318,"city":"Canyon Country","mean":464363.2785628887,"median":425345.454545455},{"zipcode":91390,"ziplat":34.52286,"ziplon":-118.39213,"city":"Santa Clarita","mean":520366.7339225319,"median":522620.779220779},{"zipcode":91401,"ziplat":34.17812,"ziplon":-118.43146,"city":"Van Nuys","mean":582610.2967489434,"median":530145.454545454},{"zipcode":91402,"ziplat":34.22411,"ziplon":-118.44481,"city":"Panorama City","mean":376171.8343097985,"median":363535.064935065},{"zipcode":91403,"ziplat":34.14659,"ziplon":-118.46286,"city":"Sherman Oaks","mean":697450.9150557144,"median":596607.7922077921},{"zipcode":91405,"ziplat":34.20119,"ziplon":-118.44811,"city":"Van Nuys","mean":433604.0944371347,"median":397158.441558442},{"zipcode":91406,"ziplat":34.19818,"ziplon":-118.48975,"city":"Van Nuys","mean":456215.9750901483,"median":432174.6753246755},{"zipcode":91411,"ziplat":34.17855,"ziplon":-118.45922,"city":"Van Nuys","mean":511540.0143900416,"median":453848.051948052},{"zipcode":91423,"ziplat":34.14852,"ziplon":-118.43272,"city":"Sherman Oaks","mean":683953.4162220212,"median":590787.012987013},{"zipcode":91436,"ziplat":34.15087,"ziplon":-118.49229,"city":"Encino","mean":797432.077554173,"median":742431.168831169},{"zipcode":91501,"ziplat":34.20052,"ziplon":-118.29583,"city":"Burbank","mean":497367.7321364575,"median":468279.220779221},{"zipcode":91502,"ziplat":34.17684,"ziplon":-118.30926,"city":"Burbank","mean":350468.1772128581,"median":337200.0},{"zipcode":91504,"ziplat":34.20451,"ziplon":-118.32701,"city":"Burbank","mean":547871.4824553083,"median":522403.896103896},{"zipcode":91505,"ziplat":34.17473,"ziplon":-118.34677,"city":"Burbank","mean":476994.6837089125,"median":457514.935064935},{"zipcode":91506,"ziplat":34.17123,"ziplon":-118.32382,"city":"Burbank","mean":499504.6391964206,"median":474909.090909091},{"zipcode":91601,"ziplat":34.16854,"ziplon":-118.37254,"city":"North Hollywood","mean":483536.3400236125,"median":425716.883116883},{"zipcode":91602,"ziplat":34.15103,"ziplon":-118.36631,"city":"North Hollywood","mean":554933.6044237445,"median":500645.454545455},{"zipcode":91604,"ziplat":34.13882,"ziplon":-118.39353,"city":"Studio City","mean":792798.2922697655,"median":670876.6233766235},{"zipcode":91605,"ziplat":34.20721,"ziplon":-118.40025,"city":"North Hollywood","mean":412748.8681852296,"median":399824.6753246755},{"zipcode":91606,"ziplat":34.1866,"ziplon":-118.38871,"city":"North Hollywood","mean":434695.5407129536,"median":405069.4805194804},{"zipcode":91607,"ziplat":34.16622,"ziplon":-118.40008,"city":"Valley Village","mean":593801.7868287318,"median":533610.3896103895},{"zipcode":91702,"ziplat":34.26557,"ziplon":-117.86722,"city":"Azusa","mean":342835.8282188975,"median":334435.7142857145},{"zipcode":91706,"ziplat":34.09641,"ziplon":-117.96816,"city":"Baldwin Park","mean":354671.9766210255,"median":346651.948051948},{"zipcode":91711,"ziplat":34.12853,"ziplon":-117.71561,"city":"Claremont","mean":510134.4846480787,"median":476446.753246753},{"zipcode":91722,"ziplat":34.09726,"ziplon":-117.90616,"city":"Covina","mean":416993.0550032499,"median":403407.7922077925},{"zipcode":91723,"ziplat":34.08476,"ziplon":-117.88643,"city":"Covina","mean":449761.0083066042,"median":434489.61038961},{"zipcode":91724,"ziplat":34.08072,"ziplon":-117.85502,"city":"Covina","mean":460601.8786301349,"median":429605.194805195},{"zipcode":91731,"ziplat":34.07877,"ziplon":-118.04063,"city":"El Monte","mean":460386.0353321893,"median":439712.987012987},{"zipcode":91732,"ziplat":34.07343,"ziplon":-118.01445,"city":"El Monte","mean":447190.1771465358,"median":428927.272727273},{"zipcode":91733,"ziplat":34.04553,"ziplon":-118.05318,"city":"South El Monte","mean":366027.5413536527,"median":346645.454545455},{"zipcode":91740,"ziplat":34.11879,"ziplon":-117.85396,"city":"Glendora","mean":435183.3982219058,"median":421888.311688312},{"zipcode":91741,"ziplat":34.15372,"ziplon":-117.84368,"city":"Glendora","mean":509770.0055811302,"median":489300.0},{"zipcode":91744,"ziplat":34.02889,"ziplon":-117.93732,"city":"La Puente","mean":358863.4350540327,"median":353367.532467532},{"zipcode":91745,"ziplat":33.99931,"ziplon":-117.97325,"city":"Hacienda Heights","mean":434348.5752522061,"median":412571.4285714285},{"zipcode":91746,"ziplat":34.04426,"ziplon":-117.98625,"city":"La Puente","mean":373452.4453554211,"median":364184.4155844155},{"zipcode":91748,"ziplat":33.97661,"ziplon":-117.8997,"city":"Rowland Heights","mean":460716.9847800927,"median":419062.337662338},{"zipcode":91750,"ziplat":34.16084,"ziplon":-117.77278,"city":"La Verne","mean":449030.2078010944,"median":408229.87012987},{"zipcode":91754,"ziplat":34.05096,"ziplon":-118.1446,"city":"Monterey Park","mean":486187.0642857148,"median":449835.714285714},{"zipcode":91755,"ziplat":34.048,"ziplon":-118.11499,"city":"Monterey Park","mean":466521.3153486637,"median":440350.0},{"zipcode":91765,"ziplat":33.98822,"ziplon":-117.81446,"city":"Diamond Bar","mean":479120.3761852951,"median":443557.142857143},{"zipcode":91766,"ziplat":34.04179,"ziplon":-117.75691,"city":"Pomona","mean":351192.3728872584,"median":317916.883116883},{"zipcode":91767,"ziplat":34.08143,"ziplon":-117.73844,"city":"Pomona","mean":344324.6650554306,"median":328167.532467532},{"zipcode":91768,"ziplat":34.06387,"ziplon":-117.79065,"city":"Pomona","mean":352274.5587343418,"median":330775.974025974},{"zipcode":91770,"ziplat":34.0644,"ziplon":-118.08365,"city":"Rosemead","mean":427379.1716325298,"median":402448.701298701},{"zipcode":91773,"ziplat":34.11004,"ziplon":-117.80981,"city":"San Dimas","mean":466526.5987830128,"median":440957.1428571425},{"zipcode":91775,"ziplat":34.1144,"ziplon":-118.08944,"city":"San Gabriel","mean":618090.5964301258,"median":557141.5584415579},{"zipcode":91776,"ziplat":34.08988,"ziplon":-118.09494,"city":"San Gabriel","mean":524893.8494758243,"median":496180.519480519},{"zipcode":91780,"ziplat":34.10148,"ziplon":-118.05547,"city":"Temple City","mean":567265.1014548355,"median":524187.6623376625},{"zipcode":91789,"ziplat":34.01831,"ziplon":-117.85463,"city":"Walnut","mean":551433.5007606985,"median":503342.857142857},{"zipcode":91790,"ziplat":34.06735,"ziplon":-117.93771,"city":"West Covina","mean":411191.7126404062,"median":396418.831168831},{"zipcode":91791,"ziplat":34.06107,"ziplon":-117.89403,"city":"West Covina","mean":461326.1299140418,"median":434551.948051948},{"zipcode":91792,"ziplat":34.02584,"ziplon":-117.89994,"city":"West Covina","mean":434368.3969211982,"median":407802.5974025975},{"zipcode":91801,"ziplat":34.09076,"ziplon":-118.12756,"city":"Alhambra","mean":491825.8096506015,"median":470414.2857142854},{"zipcode":91803,"ziplat":34.07494,"ziplon":-118.14621,"city":"Alhambra","mean":477856.306043925,"median":452388.311688312},{"zipcode":93510,"ziplat":34.46511,"ziplon":-118.21416,"city":"Acton","mean":427036.6559532298,"median":407118.1818181821},{"zipcode":93532,"ziplat":34.68472,"ziplon":-118.54414,"city":"Lake Hughes","mean":263547.2837619898,"median":259565.5844155845},{"zipcode":93534,"ziplat":34.71569,"ziplon":-118.15122,"city":"Lancaster","mean":278548.510100236,"median":276070.12987013},{"zipcode":93535,"ziplat":34.71306,"ziplon":-117.87825,"city":"Lancaster","mean":268616.5206123751,"median":270718.181818182},{"zipcode":93536,"ziplat":34.74709,"ziplon":-118.36875,"city":"Lancaster","mean":331464.7061323958,"median":331691.5584415585},{"zipcode":93543,"ziplat":34.48918,"ziplon":-117.97085,"city":"Littlerock","mean":229099.6781644015,"median":221770.12987013},{"zipcode":93544,"ziplat":34.49303,"ziplon":-117.75432,"city":"Llano","mean":235494.3655566224,"median":234380.519480519},{"zipcode":93550,"ziplat":34.41325,"ziplon":-118.09161,"city":"Palmdale","mean":315673.1809556097,"median":312734.4155844155},{"zipcode":93551,"ziplat":34.60169,"ziplon":-118.23101,"city":"Palmdale","mean":405023.2292867237,"median":404654.545454545},{"zipcode":93552,"ziplat":34.57142,"ziplon":-118.02319,"city":"Palmdale","mean":366577.7690762616,"median":364627.2727272725}]';
  var arrayD = JSON.parse(result.toString());
  // console.log(arrayD);

  arrayD.map(function(d,i){
    position = {lat: d.ziplat, lng: d.ziplon};

    var cir = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      //map: map,
      position: position,
      center: position,
      radius: Math.sqrt(d.median)*1.5,
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      city: d.city
    });

    median_arr.push(cir);
    // Create an onclick event to open an infowindow at each marker.
    cir.addListener('click', function() {
      cir_popup(this, largeInfowindow);
    });
  });

  circlemedian();
}

function cir_popup(cir, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.cir != cir) {
    infowindow.cir = cir;
    var valmedian = parseFloat(cir.median);

    var content = `
      <div class=tip>
      <table style="margin-top: 2.5px;">
          <tr><td>City: </td><td>&nbsp;` + cir.city + `</td></tr>
          <tr><td>Zip Code: </td><td>&nbsp;` + cir.zip + `</td></tr>
          <tr><td>Median Price: </td><td>&nbsp;$` + valmedian.format(2) + `</td></tr>
      </table>
      </div>
      `;
    infowindow.setContent(content);
    infowindow.open(map, cir);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.cir = null;
    });
  }
}

// draw median circle
function circlemedian() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < median_arr.length; i++) {
    median_arr[i].setMap(map);
    bounds.extend(median_arr[i].position);
  }
  // map.fitBounds(bounds);
  map.setZoom(12);
}

function initMap() {
  // call ajax to get median
  getmedian();
  // Create a styles array to use with the map.
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lalatlon.lat, lng: lalatlon.lon},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // var largeInfowindow = new google.maps.InfoWindow();
  largeInfowindow = new google.maps.InfoWindow();

  // draw user zip marker
  console.log(lalatlon);
  var marker = new google.maps.Marker({
    position: {lat: lalatlon.lat, lng: lalatlon.lon},
    map: map,
    animation: google.maps.Animation.DROP,
    title: ajaxdata.zipcode,
    icon: iconBase + 'homegardenbusiness.png'
  });

} // end of initMap()
