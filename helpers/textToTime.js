export function textToTime(text) {
    // Split the text to get hours and minutes
    var parts = text.split(':');

    // Assuming the text is in HH:mm format
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);

    // Create a new Date object with current date and specified time
    var time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);

    return time;
}