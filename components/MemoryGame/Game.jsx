"use client";
import React, { useEffect, useRef, useState } from "react";

const PIXI_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js";

const MemoryGame = () => {
	const containerRef = useRef(null);
	const appRef = useRef(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let scriptEl;

		const ensurePixi = () => {
			return new Promise((resolve) => {
				if (window.PIXI) {
					resolve();
					return;
				}
				scriptEl = document.createElement("script");
				scriptEl.src = PIXI_CDN;
				scriptEl.async = true;
				scriptEl.onload = () => resolve();
				document.body.appendChild(scriptEl);
			});
		};

		const initGame = () => {
			const PIXI = window.PIXI;
			const stage = new PIXI.Container();
			const renderer = PIXI.autoDetectRenderer({ width: 640, height: 480, backgroundColor: 0x888888 });
			appRef.current = { stage, renderer };

			const loader = new PIXI.Loader();
			loader.add("tileAtlas", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/9729/images.json");
			loader.load(() => onTilesLoaded(PIXI, loader, stage, renderer));

			if (containerRef.current) {
				containerRef.current.innerHTML = "";
				containerRef.current.appendChild(renderer.view);
			}

			const animate = () => {
				appRef.current?.raf && cancelAnimationFrame(appRef.current.raf);
				const loop = () => {
					appRef.current.raf = requestAnimationFrame(loop);
					renderer.render(stage);
				};
				loop();
			};

			animate();
			setIsReady(true);
		};

		ensurePixi().then(initGame);

		return () => {
			if (appRef.current) {
				if (appRef.current.raf) cancelAnimationFrame(appRef.current.raf);
				try {
					appRef.current.renderer.destroy(true);
				} catch {}
				appRef.current = null;
			}
			if (scriptEl) {
				scriptEl.remove();
			}
		};
	}, []);

	return (
		<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
			<div>
				<h1 style={{ color: "#fff", textAlign: "center", marginBottom: 16 }}>Memory Game</h1>
				<div ref={containerRef} style={{ width: 640, height: 480, margin: "0 auto", borderRadius: 8, overflow: "hidden" }} />
				{!isReady && (
					<p style={{ color: "#aaa", textAlign: "center", marginTop: 12 }}>Loading...</p>
				)}
			</div>
		</div>
	);
};

function onTilesLoaded(PIXI, loader, stage, renderer) {
	let firstTile = null;
	let secondTile = null;
	let canPick = true;

	const chosenTiles = [];
	while (chosenTiles.length < 48) {
		const candidate = Math.floor(Math.random() * 44);
		if (chosenTiles.indexOf(candidate) === -1) {
			chosenTiles.push(candidate, candidate);
		}
	}

	for (let i = 0; i < 96; i++) {
		const from = Math.floor(Math.random() * 48);
		const to = Math.floor(Math.random() * 48);
		const tmp = chosenTiles[from];
		chosenTiles[from] = chosenTiles[to];
		chosenTiles[to] = tmp;
	}

	const tiles = [];
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 6; j++) {
			const tile = new PIXI.Sprite(loader.resources.tileAtlas.textures[chosenTiles[i * 6 + j]]);
			tile.buttonMode = true;
			tile.interactive = true;
			tile.isSelected = false;
			tile.theVal = chosenTiles[i * 6 + j];
			tile.position.x = 7 + i * 80;
			tile.position.y = 7 + j * 80;
			tile.tint = 0xffffff;
			tile.alpha = 1;
			stage.addChild(tile);
			tiles.push(tile);
		}
	}

	setTimeout(function () {
		tiles.forEach(function (tile) {
			tile.tint = 0x000000;
			tile.alpha = 0.5;
		});
	}, 2000);

	tiles.forEach(function (tile) {
		tile.on("pointerdown", function () {
			if (canPick) {
				if (!this.isSelected) {
					this.isSelected = true;
					this.tint = 0xffffff;
					this.alpha = 1;
					if (firstTile == null) {
						firstTile = this;
					} else {
						secondTile = this;
						canPick = false;
						if (firstTile.theVal === secondTile.theVal) {
							setTimeout(function () {
								stage.removeChild(firstTile);
								stage.removeChild(secondTile);
								firstTile = null;
								secondTile = null;
								canPick = true;
							}, 1000);
						} else {
							setTimeout(function () {
								firstTile.isSelected = false;
								secondTile.isSelected = false;
								firstTile.tint = 0x000000;
								secondTile.tint = 0x000000;
								firstTile.alpha = 0.5;
								secondTile.alpha = 0.5;
								firstTile = null;
								secondTile = null;
								canPick = true;
							}, 1000);
						}
					}
				}
			}
		});
	});
}

export default MemoryGame;


