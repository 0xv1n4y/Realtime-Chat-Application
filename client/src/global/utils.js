
const urlMapping = () => {
    const mapping= {};
    const getAPIHost = () => {
        let origin = window.location.origin;
        let port = window.location.port;
        if(origin.includes('localhost')){
            return origin.replace(`${port}`,`${7010}`);
        }
    }
    mapping.apiHost = getAPIHost();
    return mapping;

}

export const urls = urlMapping();