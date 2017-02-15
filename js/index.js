function loadIssues(label)
{
    var url = "https://api.github.com/repos/techlahoma/user-groups/issues?per_page=100&labels="
        + label;

    //TODO: get subsequent pages of results if there are more than 100

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
    if (data.length > 0)
    {
        createDivForList(label);

        var sortedIssues = _.sortBy(data, [function (issue)
        {
            return getDateForIssue(issue);
        }]);

        var list = $("#" + label);

        for (i = 0; i < sortedIssues.length; i++)
        {
            var date = getDateForIssue(sortedIssues[i]);

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

function getDateForIssue(issue)
{
    return getDate(issue.title) || getDate(issue.body) || "";
}

function getDate(input)
{
    var result = null;
    var yyyymmdd = /\d{4}-\d{2}-\d{2}/;
    var match = input.match(yyyymmdd);

    if (match)
    {
        result = match[0];
    }
    else
    {
        var mmddyyyy = /(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/;
        match = input.match(mmddyyyy);

        if (match)
        {
            result = getDateFromMonthDayYearFormat(match);
        }
        else
        {
            var mmdd = /(\d{1,2})\/(\d{1,2})/;
            match = input.match(mmdd);

            if (match)
            {
                result = getDateFromMonthDayFormat(match);
            }
        }
    }

    return result;
}

function getDateFromMonthDayYearFormat(match)
{
    //yyyy-mm-dd
    var year = match[3];
    var month = (match[1].length == 1 ? "0" : "") + match[1];
    var day = (match[2].length == 1 ? "0" : "") + match[2];
    var result = year + "-" + month + "-" + day;
    return result;
}

function getDateFromMonthDayFormat(match)
{
    //yyyy-mm-dd assuming the current year
    var year = new Date().getFullYear();
    var month = (match[1].length == 1 ? "0" : "") + match[1];
    var day = (match[2].length == 1 ? "0" : "") + match[2];
    var result = year + "-" + month + "-" + day;
    return result;
}

function getItemClass(date)
{
    var today = moment(new Date()).format('YYYY-MM-DD');

    if (date == "")
    {
        return " list-group-item-info";
    }
    else if (date < today)
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
    var result = title;
    var start = title.indexOf(" for ");
    var end = title.indexOf("|");

    if (start >= 0 && end < 0)
    {
        //if there isn't a pipe, get the text between " for " and any digits (probably the date)
        var pattern = /(?: for )(\D*)(?= \d)/;
        var match = title.match(pattern);

        if (match)
        {
            result = match[1];
        }
    }
    else if (start >= 0 && end >= 0)
    {
        result = title.substring(start + " for ".length, end).replace(" event", "");
    }

    return result.trim();
}
