<script lang="ts">
    import { components as NIL } from '@nil-/3d';
    const { Canvas } = NIL;
    const { Camera, KeyboardControl, Target } = NIL.camera.arcrotate;
    const { HemisphericLight } = NIL.lights;
    const { Box, Ground } = NIL.mesh;
    const { StandardMaterial, RefMaterial } = NIL.material;
    const { TransformNode, MeshActionManager } = NIL.core;
    const { HighlightLayer } = NIL.effects;

    let target = '';
    let intensity = 0.3;
    let direction: [number, number, number] = [0, 1, 0];
    let position: [number, number, number] = [0, 0.5, 0];
    let rotation: [number, number, number] = [0, 0, 0];
    let scaling: [number, number, number] = [5, 5, 5];
    let color: [number, number, number] = [0, 1, 0];

    $: inversepos = [-position[0], -position[1], -position[2]] as [number, number, number];
    $: inverserot = [-rotation[0], -rotation[1], -rotation[2]] as [number, number, number];

    let hovered: string[] = [];
    let picked: string[] = [];
    let toggle = true;
    function click() {
        toggle = !toggle;
        picked = [];
    }

    function hoverIn({ detail: { id } }: { detail: { id: string } }) {
        if (!hovered.includes(id)) {
            hovered = [...hovered, id];
        }
    }

    function hoverOut({ detail: { id } }: { detail: { id: string } }) {
        hovered = hovered.filter((i) => i !== id);
    }

    function pick({ detail: { id } }: { detail: { id: string } }) {
        if (!picked.includes(id)) {
            picked = [...picked, id];
        }
    }

    $: highlighted = [...new Set(hovered.concat(picked))];
</script>

<Canvas>
    <StandardMaterial id="material" useLogarithmicDepth alpha={0.7} color={[255, 0, 0]} />

    <Camera
        id="camera"
        sensibility={[2000, 2000]}
        betalimit={[0, Math.PI / 2 - 0.1]}
        radiuslimit={[0.1, 50]}
    >
        {#if toggle}
            <Target {target} />
            <KeyboardControl />
        {/if}
    </Camera>
    <HemisphericLight id="light" {intensity} {direction} />

    <HighlightLayer id="highlight1" {highlighted} {color} />

    <TransformNode id="groundgroup" position={[0, -0.001, 0]} disabled={false}>
        <Ground id="ground">
            <StandardMaterial id="ground" useLogarithmicDepth alpha={1} color={[0, 0, 128]} />
        </Ground>
    </TransformNode>

    <Box id="box1" {position} {rotation}>
        <RefMaterial id="material" />
        <MeshActionManager on:hoverIn={hoverIn} on:hoverOut={hoverOut} on:pick={pick} />
    </Box>
    <Box id="box2" position={inversepos} rotation={inverserot}>
        <RefMaterial id="material" />
        <MeshActionManager on:hoverIn={hoverIn} on:hoverOut={hoverOut} on:pick={pick} />
    </Box>

    <TransformNode id="group1" {rotation} {scaling}>
        <Box id="box3" position={[2, 0.5, 2]} scaling={[1, 1, 1]}>
            <RefMaterial id="material" />
            {#if toggle}
                <MeshActionManager on:hoverIn={hoverIn} on:hoverOut={hoverOut} on:pick={pick} />
            {/if}
        </Box>
        <Box id="box4" position={[3, 0.5, 3]} scaling={[1, 1, 1]}>
            <RefMaterial id="material" />
            <MeshActionManager on:hoverIn={hoverIn} on:hoverOut={hoverOut} on:pick={pick} />
        </Box>
    </TransformNode>
</Canvas>

<div>
    <select bind:value={target}>
        {#each ['', 'box1', 'box2', 'box3', 'box4', 'group1'] as id}
            <option value={id}>
                {id}
            </option>
        {/each}
    </select>
    <button on:click={click}>onHover Box3: {toggle}</button>
    <input type="range" min="0" max="1" step="0.001" bind:value={color[0]} />
    <input type="range" min="0" max="1" step="0.001" bind:value={color[1]} />
    <input type="range" min="0" max="1" step="0.001" bind:value={color[2]} />
    <br />
    <input type="range" min="0" max="1" step="0.01" bind:value={intensity} />
    <br />
    <input type="range" min="-10" max="10" step="0.01" bind:value={direction[0]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={direction[1]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={direction[2]} />
    <br />
    <input type="range" min="-10" max="10" step="0.01" bind:value={position[0]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={position[1]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={position[2]} />
    <br />
    <input type="range" min="-10" max="10" step="0.01" bind:value={rotation[0]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={rotation[1]} />
    <input type="range" min="-10" max="10" step="0.01" bind:value={rotation[2]} />
    <br />
    <input type="range" min="0.001" max="10" step="0.01" bind:value={scaling[0]} />
    <input type="range" min="0.001" max="10" step="0.01" bind:value={scaling[1]} />
    <input type="range" min="0.001" max="10" step="0.01" bind:value={scaling[2]} />
</div>

<style>
    div {
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
        padding-top: 10px;
        padding-left: 10px;
    }
</style>
