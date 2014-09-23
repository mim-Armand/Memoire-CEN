package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	
	public class Poubelle extends MovieClip {
		
		private var _vitesse:Number=35;
		private var _indice:uint;

		public function Poubelle() {
			// constructor code
			trace(this);
		}
		
		public function avance(){
			addEventListener(Event.ENTER_FRAME,bouge);  
		}
		
		
		private function bouge(e:Event):void{
			this.x=this.x - _vitesse;
		}
		
		//=============getters et setters==================
		//================================================
		public function get indice():uint{
			return _indice;
		}
		

		public function set indice(value:uint){
			 _indice=value;
		}


	}
	
}
