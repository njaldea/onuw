<script lang="ts">
    import * as BABYLON from 'babylonjs';
    let canvas: HTMLCanvasElement;

    import { onMount } from 'svelte';
    let engine: BABYLON.Engine;
    let scene: BABYLON.Scene;

    let value = 5;
    let box1: BABYLON.Mesh;

    const render = () => scene && requestAnimationFrame(() => scene.render());

    onMount(() => {
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0.9, 0.3, 0.3, 1);

        scene.onReadyObservable.add(render);

        const camera = new BABYLON.ArcRotateCamera(
            'Camera',
            Math.PI / 2,
            Math.PI / 2,
            10,
            new BABYLON.Vector3(10, 10, -30),
            scene
        );
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true, false);
        camera.onViewMatrixChangedObservable.add(() => {
            render();
            camera.update();
        });

        scene.onPointerObservable.add(() => camera.update());

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, -15), scene);
        light.intensity = 0.7;

        const material = new BABYLON.StandardMaterial('material', scene);
        material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        material.alpha = 0.4;

        function createBox(x: number, z: number) {
            const box = BABYLON.MeshBuilder.CreateBox(
                'cube',
                { height: 5, width: 5, depth: 5 },
                scene
            );
            box.material = material;
            box.position.x = x;
            box.position.y = 0 + 2.5;
            box.position.z = z;
            return box;
        }
        box1 = createBox(0, 0);
        camera.setTarget(box1);
        createBox(2.5, 2.5);
        render();
    });

    function extend(v: number) {
        if (box1 != null) {
            // box1.scaling.x = value;
            // box1.rotation.y = value;
            box1.position.x = value;
            render();
        }
    }

    $: extend(value);
</script>

<svelte:window
    on:resize={() => {
        console.log('window resize');
        engine && engine.resize();
        scene && scene.render();
    }}
/>

<div>
    <button on:click={render}>Render</button>
    <input type="range" min={0.1} max={10.0} step={0.001} bind:value />
</div>
<canvas bind:this={canvas} />

<style>
    div {
        width: 50px;
        position: absolute;
    }
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
