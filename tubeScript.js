window.onload = function() {

    var ids = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
    var tube_left_offset = ["100px", "200px", "300px", "400px", "500px", "600px",
                             "100px", "200px", "300px", "400px", "500px", "600px"];
            
    var water_top_pos = ["90px","80px", "70px", "60px", "50px", "40px", "30px", "20px", "10px"];
    var water_top_pos_legend = ["180px","160px", "140px", "120px", "100px", "80px", "60px", "40px", "20px"];
    var number_marker_top_pos = ["170px","150px", "130px", "110px", "90px", "70px", "50px", "30px", "10px", "-5px"];

    var tube_width = 30;
    var tube_length = 100;
    var max_water_allowed = 90;

    // below contains mapping to months to test tube indices
    var month_to_index_map = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12 
    };


    // below contains water level in various tubes
    var tube_level = {
        "one": 70,
        "two": 40,
        "three": 20,  // +10
        "four": 60,  // +10
        "five": 40,  // +10
        "six": 20,
        "seven": 20, // +10
        "eight": 40, // +10  
        "nine": 60,
        "ten": 70,
        "eleven": 20,
        "twelve": 20
    };

    var position = [100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600];
    var lower_bound = 1, upper_bound = 12;
    var color_flag = 0;
    var tube_numbers = document.querySelectorAll(".number");

    // fill water in the test tubes
    for(let i = 0; i < upper_bound; i++){
        let elem = document.getElementById(ids[i]);
        elem.style.left = tube_left_offset[i];
        
        // insert the colors(representing water) in the test tubes
        let cur_water_in_tube = tube_level[ids[i]];
        color_flag = 0;
        let water_level = 0;
        for(let j = 0; j < 9; j++){
            let css_style = ' style="position: absolute; height: 10%; width: 100%; top: ' + water_top_pos[j] ; 

            if(cur_water_in_tube > 0){
                if(color_flag === 0){
                    css_style += '; background-color: blue';
                }else{
                    css_style += '; background-color: lightblue';
                }
                
                color_flag = (color_flag + 1)%2;
                
            }
            
            css_style += '; transition: background-color 0.5s "';
            elem.innerHTML += '<div class="colors" ' + css_style + '></div>';            
            cur_water_in_tube -= 10;
            
        }
        
        // align the tube numbers
        if( i < 6){
            tube_numbers[i].style.top = (100 + tube_length) +"px";
        }else{
            tube_numbers[i].style.top = (300 + tube_length) + "px";
        }
        tube_numbers[i].style.left = (position[i] + tube_width/3) + "px";

    }

    // fill water and marking in the legend test tube
    let legend_elem = document.getElementById("legend");
    let marker_elem = document.getElementById("marker-div");
    let number_elem = document.getElementById("number-div");
    let water_level = 10;
    color_flag = 0;
    for(let j = 0; j< 10; j++){
        let css_style = ' style="position: absolute; height: 10%; width: 100%; top: ' + water_top_pos_legend[j] ; 
        let marker_style = ' style="position: absolute; height: 10%; width: 100%; border-top: 1px solid black; top: ' + water_top_pos_legend[j]; 
        let number_style;
        if(j < 9){
            number_style = ' style="position: absolute; height: 10%; width: 100%; top: ' + number_marker_top_pos[j]; 
        }else{
            // this block is to position the number '100' on the scale slightly rightwards
            number_style = ' style="position: absolute; height: 10%; width: 100%; right: 5px; top: ' + number_marker_top_pos[j];
        }

        if(color_flag === 0){
            css_style += '; background-color: blue"';
        }else{
            css_style += '; background-color: lightblue"';
        }

        number_style += ' " ';
        marker_style += ' " ';
        color_flag = (color_flag + 1)%2;
        legend_elem.innerHTML+= '<div class="legend-colors" ' + css_style + '></div>';
        marker_elem.innerHTML+= '<div class="markers" ' + marker_style + '></div>';
        number_elem.innerHTML+=  '<span class="numbers" ' + number_style + '>'+ water_level +'</span>';
        water_level+= 10;
    }


    // hide the 'amount of water to pour' input form if user selects 'half transfer' or 'empty'
    document.getElementById("transfer-mode").addEventListener("change", function() {

        let cur_mode = document.getElementById("transfer-mode").value;
        if(cur_mode === 'Half transfer' || cur_mode === 'Empty'){
            document.getElementById("poured-amount-label").style.display = "none";
            document.getElementById("poured-amount").style.display = "none";
        }else{
            document.getElementById("poured-amount-label").style.display = "inline";
            document.getElementById("poured-amount").style.display = "inline";
        }

    });


    var tButton = document.getElementById("tButton");

    // click event handler for button below
    tButton.addEventListener("click", function() {
        let val_one =  month_to_index_map[ document.getElementById("tt-one").value ];
        let val_two = month_to_index_map[ document.getElementById("tt-two").value ];
        let transfer_mode = document.getElementById("transfer-mode").value;

        if(val_one && val_two && val_one != val_two && isValidRange(val_one) && isValidRange(val_two)){
            
            var water_to_pour;
            let illegal_transfer = false;
            if(transfer_mode === 'Half transfer'){
                if(tube_level[ ids[val_one - 1] ]%20 != 0){
                    //display an alert box
                    window.alert("Half transfer is not possible");
                    //break
                    illegal_transfer = true;
                }
                water_to_pour = Math.floor(tube_level[ ids[val_one - 1] ]/20)*10 ;
            }else if(transfer_mode === 'Transfer'){
                water_to_pour = parseInt(document.getElementById("poured-amount").value);
            }else{
                if( tube_level[ ids[val_two - 1] ] + tube_level[ ids[val_one - 1] ] > max_water_allowed){
                    //display an alert box
                    window.alert("Can't empty first tube into second tube as water will spill over");
                    illegal_transfer = true;
                }
                water_to_pour = tube_level[ ids[val_one - 1] ];
            }

            if( !illegal_transfer ) {
                //translate and rotate the first tube             
                let elem = document.getElementById(ids[val_one - 1]);
                let translation, rotation, y_translation, x_translation;
                // calculating translation along y-axis for the first tube
                if((val_one <= 6 && val_two <= 6) || (val_one > 6 && val_two > 6)){
                    y_translation = "-100px";
                
                }else if(val_one <= 6 && val_two >= 7){
                    y_translation = "100px";
                }else{
                    y_translation = "-300px";
                }
                
                //calculating translation along x-axis for the first tube
                if(isLeftOf(val_one, val_two)){
                    x_translation = position[val_two-1] - position[val_one-1] - 100;
                    rotation = "rotate(90deg)";
                }else{
                    x_translation = position[val_two-1] - position[val_one-1] + 100;
                    rotation = "rotate(-90deg)";
                }
                
                translation = "translate(" + x_translation + "px, " + y_translation+")";
                elem.style.transform = translation + " " + rotation;
                    
                // need to pour water from the 1st test tube to 2nd test tube
                var water_in_first_tube = document.getElementById(ids[val_one - 1]).querySelectorAll(".colors");
                var water_in_sec_tube = document.getElementById(ids[val_two - 1]).querySelectorAll(".colors");
                
                var water_len_tube = water_in_first_tube.length;
                var first_tube_start_index = - 1, second_tube_start_index = - 1;
                
                for(let i = water_len_tube - 1; i >= 0; i--){
                    if( getComputedStyle(water_in_first_tube[i])['backgroundColor'] !== 'rgba(0, 0, 0, 0)'){
                        first_tube_start_index = i;
                        break;
                    }
                }

                for(let i = water_len_tube - 1; i >= 0; i--){
                    if( getComputedStyle(water_in_sec_tube[i])['backgroundColor'] !== 'rgba(0, 0, 0, 0)'){
                        if(getComputedStyle(water_in_sec_tube[i])['backgroundColor'] === 'rgb(0, 0, 255)'){
                            color_flag = 0; // blue
                        }else{
                            color_flag = 1; // lightblue
                        }
                        second_tube_start_index = i;
                        break;
                    }
                }

                //console.log(first_tube_start_index);
                //console.log(second_tube_start_index);

                // start pouring water from first tube to second tube
                setTimeout( function(){
                    let i =  first_tube_start_index, j = second_tube_start_index+1;
                    color_flag = (color_flag + 1)%2;
                    while(i >= 0 && j < water_len_tube){
                        if(water_to_pour == 0){
                            break;
                        }
                        water_in_first_tube[i].style.removeProperty('background-color');
                        if(color_flag === 0){
                            water_in_sec_tube[j].style.backgroundColor = "blue";
                        }else{
                            water_in_sec_tube[j].style.backgroundColor = "lightblue";
                        }

                        color_flag = (color_flag + 1)%2;
                        i--;
                        j++;
                        tube_level[ids[val_one - 1]] -= 10;
                        tube_level[ids[val_two - 1]] += 10;
                        water_to_pour -= 10;
                    }
                    console.log(tube_level);
                }, 3000);
                
                // need to bring the test tube back to its original position after it has poured water
                setTimeout( function(){
                    document.getElementById(ids[val_one - 1]).style.removeProperty('transform');
                }, 5000);
            }

        }else{
            // show an alert box prompting the user to enter a valid number in input boxes
            window.alert("Please enter valid months for the test tubes");
        }

        function isValidRange(val){
            if(val >= lower_bound && val <= upper_bound){
                return true;
            }
            return false;
        }

        function isLeftOf(x, y){
            x = x % 6;
            if(x == 0){
                x += 6;
            }

            y = y % 6;
            if(y == 0){
                y += 6;
            }

            if(x < y){
                return true;
            }else{
                return false;
            }
        }

        

    });

    
}
