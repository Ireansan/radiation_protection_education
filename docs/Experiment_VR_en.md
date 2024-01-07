# VR teaching materials

## Experimental Details
You will experience a VR version of the visualization materials.

Please follow all the steps described in the instructions, access the Goole Form link on the experimental page, and answer the questions.
Since we do not provide a checklist, we leave it to you to decide whether you have completed all the steps.
Play standing up in the stationary mode of the Oculus.

The following restrictions are in place to reduce the processing load. This is not a defect.
- Hides the dose distribution when the user approaches a certain distance from it
- Only the right and left hands can be measured with the dosimeter
- Dosimeter readings are updated only when the trigger or grip is operated.

Confirmed problems are described below. Please check them together with the operating instructions.

---
# Operation Explanation
## Controller operation
The controller is commonly operated by both hands.

### Movement
Press the trigger on the controller to move to the position of the round circle displayed on the floor.

The dosimeters and operation panel follow the player's position and are oriented toward the center of the dose distribution.

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/move.gif alt="gif/VR/move" width="50%" />
</p>


### Dosimeter update &middot; Player placement
Initially, the dosimeter is updated when the player is following the headset and pressing the trigger when the controller ray is not colliding with the floor.
The same updates are made by operating the slider on the control panel.

Pressing the grip (the button next to the controller) also positions the player to reflect the position of the headset and controller and updates the dosimeter.
If the grip is pressed while the player is already positioned, the player will follow the headset again.

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/PlayerSet.gif alt="gif/VR/PlayerSet" width="50%" />
</p>


## Operation panel
### Protective gear
By setting the `Equipments` slider in the control panel from 0 to 1, the protective devices are enabled and reflected in the 3D model.

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/Equipments.gif alt="gif/VR/Equipments" width="50%" />
</p>


### type
Change the `type` according to each scene to change to the corresponding state.

Three X-ray laboratories are available, and the following are handled
- 1: Without curtain
- 2: Without curtain, irradiation field 15&times;15[cm].
- 3: With curtain

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/type_XRay.gif alt="gif/VR/type_XRay" width="50%" />
</p>


Two are available for the C-arm, corresponding to the following
- 1: Irradiated from directly above
- 2: Irradiated from the side

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/type_CArm.gif alt="gif/VR/type_CArm" width="50%" />
</p>

---
# Bug
## Cannot re-enter VR mode.
### Detail
Once I exit VR mode and try to re-enter by pressing `Enter VR` again, I am left with a black screen with a loading indicator.

### How to deal with it
Please reload the page.

## Drawing of dose distribution in C-arm
### Detail
The same drawing is made when the value of `clim1` is close to `clim2`.

### How to deal with it
unresolved

## Dosimeter UI covered by 3D model
### Detail
The rendering priority was changed so that it is always drawn in the foreground, but this was not reflected and the 3D model in the scene (including the dose distribution) is covered.

### How to deal with it
unresolved