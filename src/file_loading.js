export default function loadFileStream(path, type, async = true) {
	return new Promise((resolve, reject) => {
		try {
			const objEl = document.createElement("object");
			objEl.style.display = "none";
			objEl.type = type;
			objEl.async = async;
			objEl.src = path;
			
			document.body.appendChild(objEl);
			
			objEl.addEventListener("load", (evt) => {
				resolve({ status: true });
			});
			objEl.addEventListener("error", (evt) => {
				reject({
					status: false,
					message: `Failed to load file ${path}`
				});
			});
		} catch (error) {
			reject(error);
		}
	});
}