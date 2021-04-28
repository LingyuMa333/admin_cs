export const reload = {
    mounted() {
        document.addEventListener(
            "keydown",
            e => {
                if (e.keyCode == 116) {
                    e.preventDefault();
                    this.reload();
                }
            },
            false
        )
    }
}