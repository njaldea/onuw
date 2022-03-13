<script lang="ts">
    import * as BABYLON from 'babylonjs';
    let canvas: HTMLCanvasElement;

    import { onMount } from 'svelte';
    onMount(() => {
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0.9, 0.3, 0.3, 1);

        const camera = new BABYLON.ArcRotateCamera(
            'Camera',
            Math.PI / 2,
            Math.PI / 2,
            2,
            new BABYLON.Vector3(0, 0, -20),
            scene
        );
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true, true);

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, -15), scene);
        light.intensity = 0.7;

        const material = new BABYLON.StandardMaterial('material', scene);
        material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        material.alpha = 0.4;

        function createBox(x: number, y: number) {
            const box = BABYLON.MeshBuilder.CreateBox(
                'cube',
                { height: 5, width: 5, depth: 5 },
                scene
            );
            box.material = material;
            box.position = new BABYLON.Vector3(x, y, 0);
            return box;
        }
        const box1 = createBox(1, 1);
        const box2 = createBox(2, 2);

        engine.runRenderLoop(() => {
            box1.position.x += 0.01;
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });
    });
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
