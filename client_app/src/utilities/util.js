export const isEmptyObject = obj => {
    return obj ? JSON.stringify(obj) === "{}" : true;
}

export const clearObject = obj => {
    for (const prop of Object.keys(obj)) {
        delete obj[prop];
    }
}

export const intIds2Strings = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = String(obj[prop]);
    }));

    return objs
}

export const stringIds2Ints = (objs, keyProps = ["id"]) => {
    objs.forEach(obj => keyProps.forEach(prop => {
        if (obj.hasOwnProperty(prop)) obj[prop] = parseInt(obj[prop]);
    }));

    return objs
}

export const pushNewObjectsNoDuplicate = (olds, news, key) => {
    news.forEach(n => {
        if (!olds.find(i => i[key] == n[key])) olds.push(n);
    });
}

export const replaceNewObject = (objs, obj, keyProp) => {
    const index = objs.findIndex(data => obj[keyProp] == data[keyProp]);
    const orgRow = objs[index];
    const newRow = { ...orgRow, ...obj };

    objs.splice(index, 1, newRow);

    return newRow;
}

export const assembleErrorMsg = (prefix, error) => {
    let result = (error) ? `${prefix} ${error.message}` : null;

    try {
        result = result ? `${result} => ${error.response.data}` : result;
    } catch (error) {
    }

    return result;
}

export const getObjKeysLength = obj => {
    let result = 0;

    for (let k in obj) result++;

    return result;
}

export const compareArray = (a1, a2) => {
    return JSON.stringify(a1) == JSON.stringify(a2);
}

export const datetimeString2DateString = s => {
    let result = "";
    let date = new Date(s);

    if (date) {
        const yyyy = date.getFullYear();
        const month = date.getMonth() + 1;
        const MM =  `${month > 9 ? "" : "0"}${month}`;
        const day = date.getDate();
        const dd =  `${day > 9 ? "" : "0"}${day}`;

        result = `${yyyy}-${MM}-${dd}`;
    }
    

    return result;
}

export const isPasswordFormat = s => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(s);
}

export const isEmailFormat = s => {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(s);
}

export const isInt = s => {
    return /^\d+$/.test(s);
}

