const head = "127.0.0.1", port = "8000";
const URL = `http://schemify.azuolynogimnazija.lt`;

function updateHTML(event) {
    eventHTML = "";

    eventHTML += `
            <a href="#" id="link">
                <div class="event_box">
                `;
                if (event.picture != "null") {
                    `<div class="image">
                       <img src='${URL}/storage/${event.picture}' class="border border-dark">; 
                    }`;
                }
                
                eventHTML += `
                    </div>
                
                    <div class="info">
                    <div class="title_date">
                        <div class="title">
                            ${event.title}
                        </div>
                        
                        <div class="date">${event.start_date} - ${event.end_date}</div>
                    </div>
        
                    <p class="description">
                    ${event.description}
                    
                    <div class="place-status">
                        <div class="place">
            `;
        
        if (event.country != "") eventHTML += `<div>Country:  ${event.country}</div>`;
        if (event.city != "") eventHTML += `<div>City:  ${event.city}</div>`;
    
        eventHTML += `
                               
                            </div>
                        <div class="status">
                        <img src="${event.status.image}" style="width: 0.9rem;">
                        <span style="color: ${event.status.color};">${event.status.text}</span> 
                        </div>
                    </div>
                </p>
                </div>
                </div>
            </a>
            `;

    return eventHTML;
}

function ValidateEvent(data)
{
    data.title = (data.title == null)? "" : data.title;
    data.picture = (data.picture == null)? "null" : data.picture; 
    data.start_date = (data.start_date == null)? "" : data.start_date; 
    data.end_date = (data.end_date == null)? "" : data.end_date; 
    data.country = (data.country == null)? "" : data.country; 
    data.city = (data.city == null)? "" : data.city;  
    data.description = (data.description == null)? "" : data.description;  
}   

function CreateEventStatus(event)
{
    var CurrentDate = new Date(), start_date = new Date(event.start_date), end_date = new Date(event.end_date);

    if (start_date > CurrentDate)
        event.status = {
            color: "blue",
            text: "Event has not started",
            image: `${URL}/storage/uploads/blue_circle.png`
        }; 

    else if (start_date <= CurrentDate && end_date >= CurrentDate)
        event.status = {
            color: "green",
            text: "Event is ongoing",
            image: `${URL}/storage/uploads/green_circle.png`
        };  

    else 
        event.status = {
            color: "red",
            text: "Event has ended",
            image: `${URL}/storage/uploads/red_circle.png`
        };   
} 

function getEvents() {
    fetch(`${URL}/api/events`)
    .then( res => res.json() )
    .then( data => {
        let output = '';

        data.forEach(event => {
            ValidateEvent(event);
            CreateEventStatus(event);

            output += updateHTML(event);     
        });

        document.getElementById('events').innerHTML = output;
    });
}

getEvents();
