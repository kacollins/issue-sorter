var unknownDate = "unknown date";

function loadIssues(label)
{
    var url = "https://api.github.com/search/issues?q=user:techlahoma+repo:user-groups+label:"
        + label + "+state:open";

    $.getJSON(url, function (data)
    {
        if (data != undefined)
        {
            displaySortedIssues(data, label);
        }
        else
        {
            console.log("error getting " + label + " issues");
        }
    });
}

function displaySortedIssues(data, label)
{
    if (data.items.length > 0)
    {
        createDivForList(label);

        var sortedIssues = _.sortBy(data.items, [function (issue)
        {
            return getDate(issue.title);
        }]);

        var list = $("#" + label);

        for (i = 0; i < sortedIssues.length; i++)
        {
            var date = getDate(sortedIssues[i].title);

            var html = "<a href='" + sortedIssues[i].html_url
                + "' class='list-group-item list-group-item-action" + getItemClass(date) + "'>"
                + date + " " + getMeetupName(sortedIssues[i].title) + "</a>";

            list.append(html);
        }
    }
}

function createDivForList(label)
{
    var row = $("#row");

    row.append("<div id='" + label + "' class='col-md-4 list-group' style='margin:10px'>"
        + "<a href='https://github.com/techlahoma/user-groups/labels/"
        + label + "' class='list-group-item active'>"
        + "Open " + label.charAt(0).toUpperCase() + label.substring(1) + " Issues"
        + "</a>"
        + "</div>");
}

function getDate(title)
{
    var yyyymmdd = /\d{4}-\d{2}-\d{2}/;
    var match = title.match(yyyymmdd);

    if (match)
    {
        return match[0];
    }
    else
    {
        var mmddyyyy = /(\d{2})\/(\d{2})\/(\d{4})/;
        match = title.match(mmddyyyy);

        if (match)
        {
            //yyyy-mm-dd
            return match[3] + "-" + match[1] + "-" + match[2];
        }
        else
        {
            return unknownDate;
        }
    }
}

function getItemClass(date)
{
    var today = moment(new Date()).format('YYYY-MM-DD');

    if (date < today || date == unknownDate)
    {
        return " list-group-item-danger";
    }
    else if (date == today)
    {
        return " list-group-item-warning";
    }
    else
    {
        return "";
    }
}

function getMeetupName(title)
{
    var start = title.indexOf(" for ");
    var end = title.indexOf("|");

    if (start >= 0 && end >= 0)
    {
        return title.substring(start + " for ".length, end).replace(" event", "").trim();
    }
    else
    {
        return title.trim();
    }
}
