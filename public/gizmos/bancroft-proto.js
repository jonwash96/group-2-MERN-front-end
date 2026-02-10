String.prototype._ellipses = function(maxChars=80) {
	return this.length > maxChars 
      ? this.substring(0,maxChars)+"..." 
      : this;
}

String.prototype._toTitleCase = function() {
    const words = this.split(' ');
    return words.map(word => {
        if (word.charAt(0).match(/\*/)) return word.replace('*', '')
        else return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ').trim();
}

String.prototype._pluralize = function() {
    if (this.match(/s$/i)) return this + "'"
    else return this.match(/[a-z]/) 
        ? this + "s" 
        : this + "S";
}

String.prototype._camelToTitle = function() {
    let str = this.split('');
    for (let i=(str.length-2); i>=0; i--) {
        if (str[i+1].match(/[A-Z]/)) {
            str.splice(i, 1, [str[i]," "]);
            i--;
        };
    };
    const strWithSpaces = str.flat().join('');
    str = strWithSpaces.split(' ');
    str[0] = str[0].toTitleCase();
    return str.join(' ');
}

String.prototype._normalizeCSV = function() {
    if (this.match(/\,\S/g)) {
        return this.replaceAll(/\,/g, ', ')
    } else return this
}

String.prototype.epochTo = _epochTo;
Number.prototype.epochTo = _epochTo;
function _epochTo(format) {
    const date = new Date(date);
    const diff = Date.now() - Number(this);
    const oneDay = 86400000;
    const oneHour = 3600000;
    const sixHours = 21600000;
    switch (format) {
        case 'recent': {
            if (diff < oneHour) {
                return Math.floor(diff / (sixHours / 6 / 60))+" minutes ago";
            } else if (diff < sixHours) {
                return Math.floor(diff / (sixHours / 6))+" hours ago";
            } else if (diff <  oneDay*2) {
                return "Yesterday at "+date.toLocaleTimeString().replace(/:\d\d?\s/, ' ');
            } else if (diff < oneDay * 6) {
                return date.getDay().split(' ')[0]+" at"+date.toLocaleTimeString().replace(/:\d\d?\s/, ' ');
            } else {
                return date.toLocaleDateString();
            }
        }
    }
}