export default {
    type: "on",
    name: "ready",
    execute: client => {
        console.log("Logged in as " + client.user.tag);
    }
}