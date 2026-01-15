# GATB 1 

<script src="https://ibo9ct.csb.app/GATB-1.js"></script>

<script>

  var date = new Date();
  var timerMinute = 06;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("06:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
  
  //$('.option').on('click', function() {
  //$('html,body').animate({
    //    scrollTop: $(window).scrollTop() + 100
    //})
//});

</script>

# GATB 2
<script src="https://h1b6h8.csb.app/gatb2_script.js"></script>
<script>
  var date = new Date();
  var timerMinute = 06;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("06:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# GATB 3
<script src="https://h1b6h8.csb.app/gatb3_script.js"></script>

<script>
  var date = new Date();
  var timerMinute = 06;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("06:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# GATB 4
<script src="https://h1b6h8.csb.app/gatb4_script.js"></script>

<script>
  var date = new Date();
  var timerMinute = 06;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("06:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# GATB 5
<script src="https://h1b6h8.csb.app/gatb5_script.js"></script>

<script>
  var date = new Date();
  var timerMinute = 05;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("05:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# GATB 6
<script src="https://h1b6h8.csb.app/gatb6_script.js"></script>
<script>
  var date = new Date();
  var timerMinute = 07;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("07:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# GATB 7 

<script src="https://h1b6h8.csb.app/gatb7_script.js"></script>

<script>
  var date = new Date();
  var timerMinute = 06;
  var timerSecond = 00;
  var initialDate = new Date(
    date.getTime() + timerMinute * 60000 + timerSecond * 1000
  );
  $(".timer-text").css("color", "green");
  $(".timer-text").text("06:00");
  var timerInterval = setInterval(function () {
    var now = new Date().getTime();
    var distance = initialDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var paddedMinutes = String(minutes).padStart(2, "0");
    var paddedSeconds = String(seconds).padStart(2, "0");

    // change the colour
    changeColor(minutes, seconds);
    // Output the result in an element with id="demo"
    $(".timer-text").text(paddedMinutes + ":" + paddedSeconds);
    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(timerInterval);
      $(".timer-text").text("00:00");
      $(".submit-answer-form").submit();
      $(".button-2")[0].click();
    }
  }, 1000);

  function changeColor(minutes, seconds) {
    var time = minutes * 60 + seconds;
    switch (time) {
      case 360:
        $(".timer-text").css("color", "black");
        break;
      case 60:
        $(".timer-text").css("color", "red");
        break;
    }
  }
</script>

# 