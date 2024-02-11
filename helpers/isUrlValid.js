export default function isValidURL(text) {
    try {
        new URL(text);
        return true;
    } catch (error) {
        return false;
    }
}
