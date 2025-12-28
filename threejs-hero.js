// Three.js Hero Scene - Animated 3D Model with Scroll Rotation
// This script creates a 3D scene in the hero section with your Cow.glb model

(function() {
    'use strict';

    // === SCENE SETUP ===
    let scene, camera, renderer, model, mixer, clock;
    let canvas = document.getElementById('threejs-canvas');

    // Mouse interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    // Configuration
    const CONFIG = {
        modelPath: 'images/robot_playground.glb',  // Robot model!
        modelScale: 1.0,
        modelPosition: {
            x: 5,                   // Right side
            y: 0,                   // Center height
            z: 0
        },
        cameraDistance: 6,
        rotationSpeed: 0.005       // FASTER rotation!
    };

    // Initialize the Three.js scene
    function init() {
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        // Enable dragging initially (we start in hero section)
        canvas.classList.add('draggable');

        // Create the scene (where all 3D objects live)
        scene = new THREE.Scene();

        // Create the camera (your viewpoint into the scene)
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);  // Wide FOV to see cow on edge
        camera.position.set(0, 0, CONFIG.cameraDistance);
        camera.lookAt(0, 0, 0);  // Look at center

        // Create the renderer (draws the scene onto the canvas)
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,           // Transparent background
            antialias: true        // Smooth edges
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to avoid distortion

        // === LIGHTING ===
        // Ambient light (soft light from all directions)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Directional light (like sunlight from one direction)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Additional light from the other side for better visibility
        const fillLight = new THREE.DirectionalLight(0x00d9ff, 0.4);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        // Clock for animations
        clock = new THREE.Clock();

        // Load the robot GLB model
        loadModel();

        // Handle window resizing
        window.addEventListener('resize', onWindowResize, false);

        // Handle scroll for fade out
        window.addEventListener('scroll', onScroll, false);

        // Enable canvas interaction only on right side of screen (where robot is)
        document.addEventListener('mousemove', function(e) {
            const rightSideStart = window.innerWidth * 0.75; // Right 25% of screen only
            if (e.clientX > rightSideStart) {
                canvas.style.pointerEvents = 'auto';
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.pointerEvents = 'none';
                canvas.style.cursor = 'default';
            }
        }, false);

        // Handle mouse/touch interaction for rotation
        canvas.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);

        // Touch events for mobile
        canvas.addEventListener('touchstart', onTouchStart, false);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd, false);

        // Start the animation loop
        animate();
    }

    // Load the robot GLB model
    function loadModel() {
        const GLTFLoaderClass = THREE.GLTFLoader || window.GLTFLoader;

        if (!GLTFLoaderClass) {
            console.error('GLTFLoader not found!');
            return;
        }

        const manager = new THREE.LoadingManager();
        manager.onError = function(url) {
            console.warn('Error loading resource (ignoring):', url);
        };

        const loader = new GLTFLoaderClass(manager);

        // Normal solid material
        const fallbackMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.7,
            metalness: 0.3
        });

        loader.load(
            CONFIG.modelPath,
            function(gltf) {
                model = gltf.scene;

                // Keep original materials or use fallback
                model.traverse(function(child) {
                    if (child.isMesh) {
                        // Only replace if no material
                        if (!child.material) {
                            child.material = fallbackMaterial.clone();
                        }
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.x = -center.x;
                model.position.y = -center.y;
                model.position.z = -center.z;

                model.scale.set(CONFIG.modelScale, CONFIG.modelScale, CONFIG.modelScale);

                model.position.x += CONFIG.modelPosition.x;
                model.position.y += CONFIG.modelPosition.y;
                model.position.z += CONFIG.modelPosition.z;

                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).play();
                    });
                }

                scene.add(model);
                onWindowResize();

                // Hide loading indicator and show drag me text
                const loader = document.getElementById('model-loader');
                if (loader) {
                    loader.classList.add('hidden');
                    // Remove from DOM after fade out
                    setTimeout(() => loader.remove(), 500);
                }

                // Show drag me text
                const dragMeText = document.querySelector('.drag-me-text');
                if (dragMeText) {
                    dragMeText.classList.add('visible');
                }

                console.log('🤖 Robot model loaded successfully!');
            },
            function(xhr) {
                if (xhr.total > 0) {
                    const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
                    if (percentComplete % 25 === 0) {
                        console.log('Model loading: ' + percentComplete + '%');
                    }
                }
            },
            function(error) {
                console.error('Error loading robot model:', error);
            }
        );
    }

    // Create a cool sci-fi holographic 3D object
    function createSciFiModel() {
        console.log('Creating sci-fi holographic object...');

        // Create a group to hold multiple geometric shapes
        model = new THREE.Group();

        // === MAIN HOLOGRAPHIC RING ===
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.15, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.6,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        model.add(ring);

        // === INNER ROTATING OCTAHEDRON ===
        const octaGeometry = new THREE.OctahedronGeometry(0.7, 0);
        const octaMaterial = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0xa855f7,
            emissiveIntensity: 0.5,
            metalness: 1.0,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
        model.add(octahedron);

        // === WIREFRAME SPHERE OVERLAY ===
        const sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xec4899,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireframeSphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
        model.add(wireframeSphere);

        // === OUTER ROTATING RINGS ===
        for (let i = 0; i < 3; i++) {
            const orbitRingGeometry = new THREE.TorusGeometry(1.8 + i * 0.15, 0.05, 8, 64);
            const orbitRingMaterial = new THREE.MeshBasicMaterial({
                color: i === 0 ? 0x00ffff : i === 1 ? 0xfbbf24 : 0x10b981,
                transparent: true,
                opacity: 0.3
            });
            const orbitRing = new THREE.Mesh(orbitRingGeometry, orbitRingMaterial);
            orbitRing.rotation.x = Math.PI / 2;
            orbitRing.rotation.z = (Math.PI / 3) * i;
            model.add(orbitRing);
        }

        // === GLOWING PARTICLES ===
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 50;
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        model.add(particles);

        // Store references for animation
        model.userData = {
            ring: ring,
            octahedron: octahedron,
            wireframeSphere: wireframeSphere,
            particles: particles
        };

        // Position the model
        model.position.set(
            CONFIG.modelPosition.x,
            CONFIG.modelPosition.y,
            CONFIG.modelPosition.z
        );

        model.scale.set(CONFIG.modelScale, CONFIG.modelScale, CONFIG.modelScale);

        // Add to scene
        scene.add(model);

        // Apply responsive positioning
        onWindowResize();

        console.log('Sci-fi holographic object created successfully! 🚀');
    }

    // Create a placeholder model if GLB loading fails
    function createPlaceholderModel() {
        console.log('Creating placeholder 3D object...');

        // Create a simple 3D shape (torus knot - looks cool)
        const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00d9ff,
            roughness: 0.5,
            metalness: 0.8,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.2
        });

        model = new THREE.Mesh(geometry, material);
        model.position.set(
            CONFIG.modelPosition.x,
            CONFIG.modelPosition.y,
            CONFIG.modelPosition.z
        );

        scene.add(model);
        console.log('Placeholder model created successfully!');
    }

    // No scroll handler needed - robot stays in hero section only
    function onScroll() {
        // Removed all scroll logic - robot is now position: absolute in hero
    }

    // Handle window resize
    function onWindowResize() {
        // Update camera aspect ratio to match window
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer size to match window exactly
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Don't change scale on resize - keep aspect ratio consistent
        // Only adjust X position for different screen sizes
        if (model) {
            const baseScale = CONFIG.modelScale;

            if (window.innerWidth < 768) {
                // Mobile: move closer to center, same scale
                model.position.x = CONFIG.modelPosition.x - 1.5;
                model.scale.set(baseScale * 0.6, baseScale * 0.6, baseScale * 0.6);
            } else if (window.innerWidth < 1200) {
                // Tablet: medium position
                model.position.x = CONFIG.modelPosition.x - 1;
                model.scale.set(baseScale * 0.8, baseScale * 0.8, baseScale * 0.8);
            } else {
                // Desktop: full size on right edge
                model.position.x = CONFIG.modelPosition.x;
                model.scale.set(baseScale, baseScale, baseScale);
            }
        }
    }

    // Mouse interaction handlers with Pointer Lock for infinite drag
    function onMouseDown(event) {
        // Request pointer lock for infinite dragging
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseMove(event) {
        if (!isDragging || !model) return;

        // Use movementX/Y for pointer lock (infinite movement)
        // Falls back to regular delta for non-locked state
        const deltaX = event.movementX !== undefined ? event.movementX : (event.clientX - previousMousePosition.x);
        const deltaY = event.movementY !== undefined ? event.movementY : (event.clientY - previousMousePosition.y);

        // Direct X and Y axis rotations
        const rotationSpeed = 0.005;

        // Horizontal drag rotates around Y axis
        const quatY = new THREE.Quaternion();
        quatY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);

        // Vertical drag rotates around X axis (drag up = rotate up)
        const quatX = new THREE.Quaternion();
        quatX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -deltaY * rotationSpeed);

        // Apply rotations
        model.quaternion.premultiply(quatY);
        model.quaternion.premultiply(quatX);

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        isDragging = false;
        // Exit pointer lock when mouse is released
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
    }

    // Touch interaction handlers for mobile
    function onTouchStart(event) {
        if (event.touches.length === 1) {
            isDragging = true;
            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    function onTouchMove(event) {
        if (!isDragging || !model || event.touches.length !== 1) return;

        event.preventDefault();

        const deltaX = event.touches[0].clientX - previousMousePosition.x;
        const deltaY = event.touches[0].clientY - previousMousePosition.y;

        // Direct X and Y axis rotations for touch
        const rotationSpeed = 0.005;

        if (model) {
            // Horizontal drag rotates around Y axis
            const quatY = new THREE.Quaternion();
            quatY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);

            // Vertical drag rotates around X axis (drag up = rotate up)
            const quatX = new THREE.Quaternion();
            quatX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -deltaY * rotationSpeed);

            // Apply rotations
            model.quaternion.premultiply(quatY);
            model.quaternion.premultiply(quatX);
        }

        previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }

    function onTouchEnd() {
        isDragging = false;
    }

    // Animation loop (runs every frame)
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Update model animations if they exist
        if (mixer) {
            mixer.update(delta);
        }

        // Rotate the robot
        if (model) {
            if (!isDragging) {
                // When not dragging, add slow auto-rotation around Y axis
                const autoRotation = new THREE.Quaternion();
                autoRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), CONFIG.rotationSpeed);
                model.quaternion.multiply(autoRotation);
            }
        }

        // Render the scene
        renderer.render(scene, camera);
    }

    // Wait for THREE.js library and GLTFLoader to load, then start
    let waitCount = 0;
    function startWhenReady() {
        waitCount++;

        // Check if THREE is loaded
        if (typeof THREE === 'undefined') {
            if (waitCount === 1) {
                console.log('Waiting for THREE.js to load...');
            }

            if (waitCount > 100) {
                console.error('THREE.js failed to load after 5 seconds. Check your internet connection.');
                return;
            }

            setTimeout(startWhenReady, 50);
            return;
        }

        // Check if GLTFLoader is loaded (might be at THREE.GLTFLoader or window.GLTFLoader)
        if (!THREE.GLTFLoader && typeof GLTFLoader === 'undefined') {
            if (waitCount === 1) {
                console.log('THREE.js loaded, waiting for GLTFLoader...');
            }

            if (waitCount > 100) {
                console.error('GLTFLoader failed to load after 5 seconds.');
                return;
            }

            setTimeout(startWhenReady, 50);
            return;
        }

        console.log('THREE.js and GLTFLoader loaded successfully!');

        // Everything is loaded, now wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    startWhenReady();

})();
