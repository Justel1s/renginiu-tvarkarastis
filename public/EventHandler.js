// const { toBePartiallyChecked } = require("@testing-library/jest-dom/dist/matchers");

const head = "127.0.0.1", port = "300";
const URL = `http://schemify.azuolynogimnazija.lt`

function updateHTML(event) {
    eventHTML = "";

    eventHTML += `
            <a href="#" id="link">
                <div class="event_box">
                `;
                if (event.picture != "null") {
                    eventHTML += `<div class="image">
                       <img src='${URL}/storage/${event.picture}' class="border border-dark">`;
                }
                
                eventHTML += `
                    </div>
                
                    <div class="info">
                    <div class="title_date">
                        <div class="title">
                            ${event.title}
                        </div>
                        `
                //Tikrina ar diena vienoda
                if (event.start_date.substring(0, 10) == event.end_date.substring(0, 10)) eventHTML += `<div class="date">${event.start_date.substring(0, event.start_date.length - 3)}-${event.end_date.substring(event.end_date.length - 8, event.end_date.length-3)}</div>`;
                else {
                    eventHTML += `<div class="date">${event.start_date.substring(0, 16)}`;
                    if (event.end_date != "" && event.start_date != event.end_date) {
                        eventHTML += ` - ${event.end_date.substring(0, 16)}`
                    }
                    eventHTML += `</div>`
                }
                eventHTML += `
                    </div>
        
                    <p class="description">
                    ${event.description}
                    
                    <div class="place-status">
                        <div class="place">
                    `;
        
        if (event.place != "") eventHTML += `<div>Vieta:  ${event.place}</div>`;
    
        eventHTML += `
                               
                            </div>
                        <div class="status">
                        <span style="color: ${event.status.color};" id="${event.status.number}">${event.status.text}</span> 
                        </div>
                    </div>
                </p>
                </div>
                </div>
            </a>
            `;

    return eventHTML;
}
var ilgis = window.innerHeight / 1000

console.log(Math.round(1000*(window.innerHeight))/1000);


var skaicius = 0;
setInterval(function() {
    window.scrollBy(0,150)
    skaicius = skaicius + 150
    console.log(skaicius)
    if(skaicius > window.innerHeight)
    {
        window.scrollBy(0, -999999)
        skaicius = 0
    }
}, 5000);

function ValidateEvent(data)
{
    data.title = (data.title == null)? "" : data.title;
    data.picture = (data.picture == null)? "null" : data.picture; 
    data.start_date = (data.start_date == null)? "" : data.start_date; 
    data.end_date = (data.end_date == null)? "" : data.end_date; 
    data.place = (data.place == null)? "" : data.place; 
    data.description = (data.description == null)? "" : data.description;  
}   

function CreateEventStatus(event)
{
    var CurrentDate = new Date(), start_date = new Date(event.start_date), end_date = new Date(event.end_date);

    if (start_date > CurrentDate)
        event.status = {
            color: "yellow",
            text: "Įvykis dar vyks",
            number: "1",
        }; 

    else if (start_date <= CurrentDate && end_date >= CurrentDate)
        event.status = {
            color: "#39FF14",
            text: "Įvykis vyksta",
            number: "0",
        };  

    else 
        event.status = {
            color: "#ff8686",
            text: "Įvykis nebevyksta",
            number: "2",
        };   
} 

function getEvents() {
    fetch(`${URL}/api/events`)
    .then( res => res.json() )
    .then( data => {
        let output = '';

        events = data.map(event => {
            ValidateEvent(event);
            CreateEventStatus(event);   
            return event; 
        });

        events.sort(function(a, b){
            return a.status.number-b.status.number;
        });

        events.forEach(event => {
            output += updateHTML(event);     
        });

        document.getElementById('events').innerHTML = output;
    });
}

getEvents();