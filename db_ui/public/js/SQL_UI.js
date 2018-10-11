//this is the code that allows for AJAX calls to the database when a button is pushed
document.getElementById('subWorkout').addEventListener('click', function(event)
{
    //get the form in so we can manipulate it
    var addExercise = document.getElementById("addExercise")
    var req = new XMLHttpRequest();
    var url = '/insert?';

    //ensure that name field is not empty
    //build GET url by inserting key/pair values one at a time
    if(document.getElementById('name').value != '')
    	url += '&name=' + document.getElementById('name').value;
    else
    {
    	alert("Name cannot be empty!");
    	return;
    }
    if(document.getElementById('inReps').value != '')
    	url += '&reps=' + document.getElementById('inReps').value;
    if(document.getElementById('inWeight').value != '')
    	url += '&weight=' + document.getElementById('inWeight').value;
    if(document.getElementById('inDate').value != '')
    	url += '&date=' + document.getElementById('inDate').value;
    if(document.getElementById('inUnit').value == 'lb')
      url += '&unit=lb'
    if(document.getElementById('inUnit').value == 'kg')
      url += '&unit=kg'

    console.log(url);

    //make the call
    req.open("GET", url, true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    req.addEventListener('load',function()
    {
      if(req.status >= 200 && req.status < 400)
      {
        var response = JSON.parse(req.responseText);
        var id = response.inserted;

        var table = document.getElementById('table_body');
        var row = table.insertRow(-1);

        //now add each data cell to the line
        //add the name to the table
        var exerciseName = document.createElement('td');
        exerciseName.textContent = addExercise.elements.name.value;
        row.appendChild(exerciseName);

        //add the reps to the table_body
        var repsCounted = document.createElement('td');
        repsCounted.textContent = addExercise.elements.reps.value;
        row.appendChild(repsCounted);

        //add the weight
        var weightLifted = document.createElement('td');
  			weightLifted.textContent = addExercise.elements.weight.value;
  			row.appendChild(weightLifted);

        //add the date
        var dateDone = document.createElement('td');
        dateDone.textContent = addExercise.elements.date.value;
        row.appendChild(dateDone);

        //add the units
        var unitsUsed = document.createElement('td');
        unitsUsed.textContent = addExercise.elements.unit.value;
        row.appendChild(unitsUsed);


        //set up edit button/action for line item
        var editLine = document.createElement('td');
        var editDataLink = document.createElement('a');
        editDataLink.setAttribute('href', '/updateTable?id=' + id);
        var editButton = document.createElement('input');
        editButton.setAttribute('value', 'Edit');
        editButton.setAttribute('type', 'button');
        editDataLink.appendChild(editButton);
        editLine.appendChild(editDataLink);
        row.appendChild(editLine);

    		//set up delete button/action for line item
        var deleteRow = document.createElement('td');
        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('value', "Delete");
        deleteButton.setAttribute('onClick', "delete_submit('id')");
        deleteRow.appendChild(deleteButton);
        row.appendChild(deleteRow);
      }
      else
        console.log("Error in network request: " + req.statusText);
    });

  req.send(url);
  event.preventDefault();
});


function delete_submit(id)
{
  $.ajax({
    url: '/delete/' + id,
    type: 'DELETE',
    success: function(result)
    {
      window.location.reload(true);
    }
  });
}
