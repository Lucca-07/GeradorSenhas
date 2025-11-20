const protocol = "http://";
const baseURL = "localhost:1111";

async function createAndSavePassword() {
    const postPasswordEndpoint = "/api/password/generate";
    const URLcompleta = `${protocol}${baseURL}${postPasswordEndpoint}`;
    const fromPassword = document.querySelector("#fromPassword").value;
    const sizePassword = Number(document.querySelector("#sizePassword").value);
    const includeUpperCase =
        document.querySelector("#includesUppercase").checked;
    const includeNumbers = document.querySelector("#includesNumbers").checked;
    const includeSpecial = document.querySelector("#includesSpecial").checked;
    console.log(
        fromPassword,
        sizePassword,
        includeUpperCase,
        includeNumbers,
        includeSpecial
    );
    const dataToSend = {
        owner_name: "ADMIN",
        from: fromPassword,
        length: sizePassword,
        uppercase: includeUpperCase,
        numbers: includeNumbers,
        special: includeSpecial,
    };
    try {
        const newpass = (await axios.post(URLcompleta, dataToSend)).data;
        console.log(newpass);
    } catch (error) {
        console.error(error);
    }
}
