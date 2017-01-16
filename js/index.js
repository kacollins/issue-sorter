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
    var sortedIssues = _.sortBy(data.items, [function (issue)
    {
        return getDate(issue.title);
    }]);

    var list = $("#" + label);

    for (i = 0; i < sortedIssues.length; i++)
    {
        list.append($('<li>').append(getDate(sortedIssues[i].title)
            + " <a href='" + sortedIssues[i].html_url + "'>"
            + getMeetupName(sortedIssues[i].title) + "</a>"));
    }
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
            return match[3] + "-" + match[1] + "-" + match[2];
        }
        else
        {
            return "unknown date";
        }
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
